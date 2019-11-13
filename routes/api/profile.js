const express = require("express");
const router = express.Router();

//@route    GET api/Profil
//@desc     Test router
//@access   Public

router.get("/", (req, res) => res.send("Profil route"));

module.exports = router;
