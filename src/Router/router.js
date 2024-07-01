const express = require("express");
const router = express.Router();
const store=require("../middleware/multer");
// const storeUpdate=require("../middleware/multerUpdate");
const {getNonceLogin, login}=require("../controllers/login");
const {userRegisteration}=require("../controllers/registeration");
const {sendEmail,emailVerify}=require("../controllers/email");
const {authenticate,adminAuthenticate}=require("../middleware/authentication");
const {profile, profileUpdate}=require("../controllers/profile");
const {verify,adminVerify}=require("../controllers/authentication")
const {logout}=require("../controllers/logout")
const {collection}=require("../controllers/collection")

const {nftCreation, nftVerification, nftCreationFee}=require("../controllers/nft/nftcreation")

const {individualnft}=require("../controllers/individualnft")
const {individualprofile}=require("../controllers/individualprofile")
const {nftSelling}=require("../controllers/nftselling")
const {nft}=require("../controllers/nfts")
const {notification}=require("../controllers/notification")
const {individualnotification}=require("../controllers/individualnotification");
const {homepagedata}=require("../controllers/homepagedata");
const {profilenft}=require("../controllers/profilenft");
const {nftdata}=require("../controllers/nftdata");
const {deletenotification, unreadnotification}=require("../controllers/notificationdata");
const { copyright } = require("../controllers/copyright");
const {copyrightdata}=require("../controllers/copyrightdata");
const {copyrightrequests}=require("../controllers/copyrightrequests");
const { copyrightaction } = require("../controllers/copyrightaction");
const { copynft } = require("../controllers/copynft");
const { copycreation } = require("../controllers/copycreation");
const { copycreationdifferent } = require("../controllers/copycreationdifferent");
const { cancelcopyright } = require("../controllers/cancelcopyright");
const { allowcopyright } = require("../controllers/allowcopyright");
const { copyrightdelete } = require("../controllers/deletecopyright");
const { copynonce } = require("../controllers/copynonce");
const { transactions } = require("../controllers/transactions");
const { buyingoptions } = require("../controllers/buyingoptions");
const { adminbuydata } = require("../controllers/adminbuydata");
const { profileInfo } = require("../controllers/profile/profile");
const { dashboardData, dashboardFeeUpdate } = require("../controllers/admin/dashboard");
const { copycreationfee } = require("../controllers/copy/copy");


const multiupload=store.fields([{name: 'profile',maxCount:1},{name: 'cover',maxCount:1}]);
// const multiuploadUpdate=storeUpdate.fields([{name: 'profile',maxCount:1},{name: 'cover',maxCount:1}]);





// registeration
router.post("/register",multiupload,userRegisteration);

// emailVerify
router.get('/verify/:token',emailVerify)


// sendEmail
router.post("/email",sendEmail);

// getNonceForLogin
router.get("/nonce/:address",getNonceLogin);

//login
router.post("/login",login);


//homepagedata
router.get("/homepage",homepagedata);

//profile
router.get("/profile",authenticate,profile);

//profileUpdate
router.patch("/profileUpdate",authenticate,multiupload,profileUpdate);

//verification
router.get("/verify",verify);
router.get("/adminverify",adminVerify);

//adminDashboard
router.get("/dashboarddata",adminAuthenticate,dashboardData);

router.post("/dashboardfeeupdate",adminAuthenticate,dashboardFeeUpdate);

//logout
router.get("/logout",logout)

//collection
router.get("/getcollection/:id",collection)

//cprofile
router.get("/getprofile",profileInfo)


//get all nfts
router.get("/getnfts/:id",nft)

//get all transactions
router.get("/gettransactions/:id",transactions)

//nftCreation
router.post("/nftCreation",authenticate,nftCreation)

//nftCreation
router.post("/nftverify",authenticate,nftVerification)


//individualnft
router.get("/individualnft/:nft_id",individualnft)

//individualprofile
router.get("/individualprofile/:profile_id",individualprofile)

//individualprofile
router.get("/profilenft/:id",profilenft)

//nftdata
router.get("/nftdata/:id",nftdata)

//nft Selling
router.post("/nftSelling",authenticate,nftSelling)

//get Notifications
router.get("/notification",authenticate,notification)


//individualnotification
router.get("/individualnotification/:notification_id",authenticate,individualnotification)

//delete notification
router.get("/deletenotification/:notification_id",authenticate,deletenotification)


//unread notification
router.get("/unreadnotification",authenticate,unreadnotification)

//copyright Request
router.post("/requestcopyright",authenticate,copyright)

//individualcopyright
router.get("/individualcopyright/:copyright_id",authenticate,copyrightdata);


//all copyright requests for specific nft
router.get("/copyrightrequests/:nftName",authenticate,copyrightrequests);


//all copyright requests for specific nft
router.post("/copyrightaction",authenticate,copyrightaction);


//all copyright requests for specific nft
router.get("/copynft/:nft_id",authenticate,copynft);


//copy creation of specific nft with same content
router.post("/copycreation",authenticate,copycreation);

//copy creation of specific nft with different content
router.post("/copycreationdifferent",authenticate,copycreationdifferent);


router.post("/copyrightcancel",authenticate,cancelcopyright);

router.post("/copyrightallow",authenticate,allowcopyright);


router.get("/copynonce/:id",authenticate,copynonce);

router.post("/copyfee",authenticate,copycreationfee)

router.delete("/copyrightdelete/:delete_id",authenticate,copyrightdelete);

//change buying options
router.post("/changebuyingoption",adminAuthenticate,buyingoptions);

//change buying options
router.get("/adminbuydata",adminAuthenticate,adminbuydata);


//get nft creation fee
router.get("/nftfee",authenticate,nftCreationFee);

module.exports = router;