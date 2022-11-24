const express = require("express");
const router = express.Router();
const store=require("../middleware/multer");
const {getNonceLogin, login}=require("../controllers/login");
const {userRegisteration}=require("../controllers/registeration");
const {sendEmail,emailVerify}=require("../controllers/email");
const {authenticate}=require("../middleware/authentication");
const {profile, profileUpdate}=require("../controllers/profile");
const {verify}=require("../controllers/authentication")
const {logout}=require("../controllers/logout")
const {collection}=require("../controllers/collection")
const {nftCreation}=require("../controllers/nftcreation")
const multiupload=store.fields([{name: 'profile',maxCount:1},{name: 'cover',maxCount:1}]);

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

//nftCreation
router.post("/nftCreation",authenticate,nftCreation)


module.exports = router;