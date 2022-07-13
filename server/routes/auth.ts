const express = require("express");


const router = express.Router();
const fs = require("../controllers/auth");
const fs1 = require("../middlewares/auth");

router.post("/signup", fs[0]);
router.post("/signin", fs[1]);
router.post("/send-email", fs[3]);
router.post("/signup_verification?email=<email-id>&token=<token>", fs[4]);// doubt 


module.exports = router;
export{};