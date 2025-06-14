const express = require('express')
const dotenv = require('dotenv')
const db_connect = require('./utils/db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require("passport")
const OAuth2Strategy = require('passport-google-oauth2').Strategy
const userModel = require('./models/userModel')
const jwt = require('jsonwebtoken')

dotenv.config()

const app = express()
const port = process.env.port || 8000;

app.use(express.json());
app.use(cookieParser())

if (process.env.mode === 'production') {
    app.use(cors())
} else {
    app.use(cors({
        origin: ["http://localhost:5174", "http://localhost:5173","https://assyria-furniture.netlify.app"],
        credentials: true,
    }))
}

app.use(session({
    secret: "erjgqrg5ergwgwt2hw5twjgh534BjugKJ", //Random key
    resave: false,
    saveUninitialized: true,
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const [firstName, lastName] = profile.displayName.split(" ");

        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
            user = new userModel({
                googleId: profile.id,
                firstName,
                lastName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
            });
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        console.error("OAuth Error:", error);
        return done(error, null);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5174/login" }), 
    async (req, res) => {
    // Create a JWT token for the user
    const tokenData = {
        _id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    
    const tokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Ensure HTTPS is being used in production
    };

    // Set the JWT token in a cookie
    res.cookie("token", token, tokenOptions);

    // Redirect to the frontend after successful login
    res.redirect("http://localhost:5174");
});


app.get('/login/success', async (req, res) => {
    if (req.user) {
        res.status(200).json({
            message: "user Login",
            user: req.user,
            success: true,
            error: false
        })
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
})

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect("http://localhost:5174");
    })
})

db_connect()

app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/productRoutes'))
app.use('/', require('./routes/userRoutes'))
app.use('/', require('./routes/addToCartRoutes'))
app.use('/', require('./routes/paymentRoutes'))


app.listen(port, () => console.log(`Server running on port ${port}!`))