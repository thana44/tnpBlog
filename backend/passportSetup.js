const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./connectDB/connectdb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
   async(accessToken, refreshToken, profile, cb)=> {
    console.log(profile)
    const checkSql = "SELECT userId, username, profileImg FROM user_table WHERE googleId = ?";
    const [User] = await pool.execute(checkSql, [profile.id])
    if(User.length === 0){
        const newUser = {
            userId: uuidv4(),
            googleId: profile.id,
            username: profile.displayName,
            profileImg: profile.photos[0].value
        }
        const insertSql = "INSERT INTO user_table(userId, googleId, username, profileImg) VALUES(?, ?, ?, ?)";
        await pool.execute(insertSql, [newUser.userId, newUser.googleId, newUser.username, newUser.profileImg])
        const token = jwt.sign({userId: newUser.userId, username: newUser.username, profileImg: newUser.profileImg}, process.env.JWT_SECRET, {expiresIn: '1h'})

        return cb(null, {profile, token})
    }
    const token = jwt.sign({userId: User[0].userId, username: User[0].username, profileImg: User[0].profileImg}, process.env.JWT_SECRET, {expiresIn: '1h'})

    return cb(null, {profile, token})
  }
))

passport.serializeUser((user, done)=>{
    done(null, user)
})

passport.deserializeUser((user, done)=>{
    done(null, user)
})