const express = require("express");
const router = express.Router();
const store=require("../middleware/multer");
// const storeUpdate=require("../middleware/multerUpdate");
const {getNonceLogin, login}=require("../controllers/login");
const {userRegisteration}=require("../controllers/registeration");
const {sendEmail,emailVerify}=require("../controllers/email");
const {authenticate}=require("../middleware/authentication");
const {profile, profileUpdate}=require("../controllers/profile");
const {verify}=require("../controllers/authentication")
const {logout}=require("../controllers/logout")
const {collection}=require("../controllers/collection")
const {nftCreation, nftNameVerification}=require("../controllers/nftcreation")
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

//logout
router.get("/logout",logout)

//collection
router.get("/getcollection/:id",collection)

//get all nfts
router.get("/getnfts/:id",nft)

//nftCreation
router.post("/nftCreation",authenticate,nftCreation)

//nftCreation
router.post("/nftnameverify",authenticate,nftNameVerification)


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


module.exports = router;