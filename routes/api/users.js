const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//TEST
//@route    GET api/users
//@desc     Test router
//@access   Public

//router.get("/", (req, res) => res.send("Utilisateur route"));

//@route    POST api/users
//@desc     Register utilisateur
//@access   Public

router.post(
  '/',
  [
    check('name', 'Nom requis')
      .not()
      .isEmpty(),
    check('email', 'Merci de saisir un email valide').isEmail(),
    check(
      'password',
      "Merci de saisir un mot de passe d'au moins 6 caractères"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send('Utilisateur route');
  }
);

module.exports = router;
