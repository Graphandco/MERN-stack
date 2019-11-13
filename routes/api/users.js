const express = require("express");
const router = express.Router();

//@route    GET api/users
//@desc     Test router
//@access   Public

router.get("/", (req, res) => res.send("Utilisateur route"));

module.exports = router;
