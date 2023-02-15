const express = require("express");
const router = express.Router();
const store=require("../middleware/multer");
const storeUpdate=require("../middleware/multerUpdate");
const {getNonceLogin, login}=require("../controllers/login");
const {userRegisteration}=require("../controllers/registeration");
const {sendEmail,emailVerify}=require("../controllers/email");
const {authenticate}=require("../middleware/authentication");
const {profile, profileUpdate}=require("../controllers/profile");
const {verify}=require("../controllers/authentication")
const {logout}=require("../controllers/logout")
const {collection}=require("../controllers/collection")
const {nftCreation}=require("../controllers/nftcreation")
const {individualnft}=require("../controllers/individualnft")
const {individualprofile}=require("../controllers/individualprofile")
const {nftSelling}=require("../controllers/nftselling")
const {nft}=require("../controllers/nfts")
const {notification}=require("../controllers/notification")
const {individualnotification}=require("../controllers/individualnotification");
const {homepagedata}=require("../controllers/homepagedata");
const {profilenft}=require("../controllers/profilenft");
const {ownernfts}=require("../controllers/ownernfts");




const multiupload=store.fields([{name: 'profile',maxCount:1},{name: 'cover',maxCount:1}]);
const multiuploadUpdate=storeUpdate.fields([{name: 'profile',maxCount:1},{name: 'cover',maxCount:1}]);





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
router.patch("/profileUpdate",authenticate,multiuploadUpdate,profileUpdate);

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


//individualnft
router.get("/individualnft/:nft_id",individualnft)

//individualprofile
router.get("/individualprofile/:profile_id",individualprofile)

//individualprofile
router.get("/profilenft/:id",profilenft)

//ownernfts
router.get("/ownernfts/:id",ownernfts)

//nft Selling
router.post("/nftSelling",authenticate,nftSelling)

//get Notifications
router.get("/notification",authenticate,notification)


//individualnotification
router.get("/individualnotification/:notification_id",authenticate,individualnotification)

module.exports = router;