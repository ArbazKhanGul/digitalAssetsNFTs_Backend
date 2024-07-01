const stripeAPI=require("../utils/stripe");
const { ethers } = require("ethers");
const User = require("../database/user")
const Notification=require("../database/notificationSchema");

// Configure your BSC node
const provider = new ethers.providers.JsonRpcProvider();

// Set up your wallet using a private key
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);


exports.webhook=async (req, res) =>{

    console.log("stripe webhook is running");
    const sig = req.headers['stripe-signature'];
    
    let event;

       event = stripeAPI.webhooks.constructEvent(
        req['rawBody'], sig, process.env.WEB_HOOK_SECRET);

        console.log("calling webook function ",event.type);

    if(event.type==="checkout.session.completed")
    {
       let session=event.data.object;

       const amountTotal = session?.amount_total;

       const customerEmail = session?.customer_email;
   
       const numberOfBNB = session?.metadata?.numberOfBNB; // Retrieve the metadata field
   
       const user_profile = await User.findOne({ email: customerEmail });

       if(user_profile){
   

        const providedBnbAmountWei = ethers.utils.parseUnits(numberOfBNB.toString(), "ether");
       
        //  Estimate gas cost
        const estimatedGas = await wallet.estimateGas({
         to: user_profile.address,
         value: providedBnbAmountWei, // Sending 1 BNB
        });
   
        const gasPriceWei = await provider.getGasPrice();
   
        // Calculate gas fee in wei
        const gasFeeWei = estimatedGas.mul(gasPriceWei);
   
        // Deduct gas fee from provided BNB amount
        const remainingBnbAmountWei = providedBnbAmountWei.sub(gasFeeWei);
   
        // Send BNB with remaining amount and gas price
        const transaction = await wallet.sendTransaction({
         to: user_profile.address,
         value: remainingBnbAmountWei,
         gasLimit: estimatedGas,
         gasPrice: gasPriceWei,
         });

         const receipt = await transaction.wait();
   
        // Check if transaction was successfully mined
        if (receipt.status === 1) {

         console.log("Transaction successfully mined. BNB sent:", transaction);

         const notification=new Notification({
            notification_for:user_profile.address,
            type:"bnb_transfer",
            price:remainingBnbAmountWei,
          })
          await notification.save();


    } else

        {
            try{
                const refund = await stripeAPI.refunds.create({
                    payment_intent: session.payment_intent, // Use the payment_intent from the session
                });
                const notification=new Notification({
                    notification_for:user_profile.address,
                    type:"bnb_refund_request",
                    price:amountTotal / 100,
                  })
                  await notification.save();
            }
            catch(err){

                const admin = await User.findOne({ role: "admin" });
                const notification=new Notification({
                    notification_for:admin.address,
                    type:"bnb_refund_failure",
                    price:amountTotal / 100,
                    userName:user_profile.authorName,
                    userId:user_profile._id
                  })
                  await notification.save();
            }
        }

       }

    }

    // refund event
    if (event.type === 'charge.refunded') {
        // Handle the refund event
        const paymentIntent = event.data.object;
        let amount=paymentIntent.amount_refunded;

        const user_profile = await User.findOne({ email: paymentIntent.email });

        const notification=new Notification({
            notification_for:user_profile.address,
            type:"bnb_refund_success",
            price:amount / 100,
          })
          await notification.save();

    }

  }
