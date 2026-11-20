const passport = require("passport");
const {Strategy} = require("passport-local");
const bcrypt = require("bcryptjs");

const User = require("../model/User");

passport.use(new Strategy({usernameField: 'email'}, async (email, password, done) => {
            try {
                const user = await User.findOne({email});
                if (!user) {
                    return done(null, false, {message: "you don't have account with this email   "})
                } else {
                    const isMuch = await bcrypt.compare(password, user.password);
                    if (isMuch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: "email or password is incorrect  "})
                    }

                }

            } catch (err) {
                console.log(err)
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
                done(null, user);
            }
        )
});
