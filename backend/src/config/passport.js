import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ googleId: profile.id });

                if (existingUser) return done(null, existingUser);

                const newUser = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// serialize
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

export default passport;
