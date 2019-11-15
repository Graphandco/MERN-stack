const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

//@route    GET api/auth
//@desc     Test router
//@access   Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur Serveur');
  }
});

//@route    POST api/auth
//@desc     Authentification utilisateur & token
//@access   Public

router.post(
  '/',
  [
    check('email', 'Merci de saisir un email valide').isEmail(),
    check('password', 'Mot de passe requis').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //Vérifie si utilisateur existe
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Identifiants invalides' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Identifiants invalides' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //Return jsonwebtoken
      //res.send('Utilisateur enregistré');
    } catch (err) {
      console.error(err.message);
      res.statut(500).send('Erreur Serveur');
    }

    //res.send('Utilisateur route');
  }
);

module.exports = router;
