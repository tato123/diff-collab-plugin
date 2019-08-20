const passport = require("passport");
const querystring = require("querystring");
const express = require("express");
const router = express.Router();
const Auth0Strategy = require("passport-auth0");
const CustomStrategy = require("passport-custom");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Guest = require("../db/Guest");
const short = require("short-uuid");
const randomAvatar = require("random-avatar");

// passport.use("auth0", new Auth0Strategy(
//     {
//       domain: process.env.AUTH0_DOMAIN,
//       clientID: process.env.AUTH0_CLIENT_ID,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET,
//       callbackURL: `${process.env.API_URL}/auth/callback`,
//       state: false
//     },
//     async (accessToken, refreshToken, extraParams, profile, done) => {
//       try {
//         // check if one exist

//         const user = await User.get({ id: profile.id });
//         console.log("user exists?", user);

//         const timestamp = Date.now().toString();

//         if (_.isNil(user)) {
//           const newUser = new User({
//             id: profile.id,
//             subscriptionPlan: "trial",
//             subscriptionStatus: "not_started",
//             created: timestamp,
//             updated: timestamp
//           });

//           await newUser.save();
//         }

//         return done(null, extraParams);
//       } catch (err) {
//         return done(err.message);
//       }
//     }
//   ));

passport.use(
  "custom",
  new CustomStrategy(async (req, done) => {
    // get the username in here
    const email = req.query.email;
    const iat = Date.now();
    const id = short.generate();
    const picture = randomAvatar({ email });

    // record the guestlog
    const guest = new Guest({ id, email, created: iat });
    await guest.save();

    return done(null, {
      email,
      picture,
      iat
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/**
 * We need to rely on our testing suite to handle these
 */
router.use(passport.initialize());

router.get(
  "/guest",
  passport.authenticate("custom", {
    failureRedirect: "http://localhost:3000/login"
  }),
  cors(),
  (req, res) => {
    const user = req.user;
    console.log("user is", user);
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    const accessToken = jwt.sign(
      Object.assign({}, user, { guest: true }),
      "shhhhh"
    );
    const idToken = jwt.sign(
      Object.assign({}, user, {
        guest: true,
        profile: null
      }),
      "shhhhh"
    );

    const token = {
      access_token: accessToken,
      id_token: idToken,
      state: "diff_app"
    };

    return res.redirect(
      301,
      `http://localhost:3000/callback?${querystring.stringify(token)}`
    );
  }
);

// // we can
// router.get(
//   "/auth/callback",
//   passport.authenticate("auth0", {
//     failureRedirect: `${process.env.WEB_APP}/login`
//   }),
//   function(req, res) {
//     const token = {
//       ...req.user,
//       state: "diff_app"
//     };

//     // Successful authentication, redirect home.
// res.redirect(
//   301,
//   `${process.env.WEB_APP}/callback#${querystring.stringify(token)}`
// );
//   }
// );

module.exports = router;
