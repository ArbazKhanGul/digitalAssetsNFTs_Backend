const stripeAPI=require('../utils/stripe');


exports.createCheckoutSession = async (req, res) => {

  const domainUrl = process.env.CLIENT_URL;
  const { amount,amountBNB } = req.body;
  let user = req?.user;

  // Check if amount and email are provided in the request body
  if (!amount) {
    throw new Error("Missing amount")
  }

  // Convert the amount to cents (smallest unit of USD)
  const amountInCents = Math.round(amount * 100);

  let session;

  try {
    session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          unit_amount: amountInCents, // Pass the converted amount
          product_data: {
            name: 'Custom Payment', // Description for the payment
          },
        },
        quantity: 1,
      }],
      metadata: {
        numberOfBNB: amountBNB, // Add the number of BNB transfer to metadata
      },
      customer_email: user.email,
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/canceled`,
    });

    res.status(200).json({ status: "success", sessionId: session.id });
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred in creating session")
  }
}
