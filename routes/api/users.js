const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //Vérifie si utilisateur existe
      let user = await User.findOne({ email });

      if (user) {
        res;
        return res
          .status(400)
          .json({ errors: [{ msg: 'Cet utilisateur existe déjà' }] });
      }
      //Récupère gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);
      //Cryptage password
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken
      res.send('Utilisateur enregistré');
    } catch (err) {
      console.error(err.message);
      res.statut(500).send('Server error');
    }

    res.send('Utilisateur route');
  }
);

module.exports = router;
