const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMiddleware = require('../middlewares/authMiddleware')
const pool = require('../connectDB/connectdb')

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/auth/google/callback', passport.authenticate('google', { session:false, failureRedirect: '/login' }), function(req, res) {
        // Successful authentication, redirect home.
        const {token, profile} = req.user
        res.cookie('token',token, {httpOnly: true})
        res.redirect(`${process.env.FRONTEND_HOST}/`);
})

router.get('/logout', async(req, res)=>{
    req.logout((err)=>{
        if(err){
            return res.json(err)
        }
        req.session.destroy((err)=>{
            if(err) return res.json(err)
            const cookieLists = ['token']
            cookieLists.forEach((c)=>{
                res.clearCookie(c)
            })
            res.redirect(`${process.env.FRONTEND_HOST}/login`)
        })
    })
})

router.get('/login-success', authMiddleware, async(req, res)=>{
    const {userId} = req.currentUser
    try{
        const getCurrentUserSql = "SELECT userId, profileImg, username FROM user_table WHERE userId = ?";
        const [result] = await pool.execute(getCurrentUserSql, [userId])
        return res.json(result[0])
    }catch(err){
        console.log(err)
    }
})

module.exports = router;