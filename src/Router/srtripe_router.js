const express = require("express");
const router = express.Router();
const {authenticate}=require("../middleware/authentication");
const {createCheckoutSession}=require("../controllers/checkout");
const {webhook}=require("../controllers/webhook")
const {buycryptodata}=require("../controllers/cryptobuy/buycryptodata");

router.get("/buycryptodata",authenticate,buycryptodata);

router.post('/create-checkout-session', authenticate,createCheckoutSession);

router.post('/webhook', webhook);

module.exports = router;