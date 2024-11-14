const { v4: uuidv4 } = require("uuid")
const pool = require('../connectDB/connectdb')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const test = async () => {
    try {
      const connection = await pool.getConnection();
      console.log('MySQL connected successfully!');
      connection.release();
    } catch (err) {
      console.error('MySQL connection failed:', err);
    }
  };
test()

const registerController = async(req, res)=>{
    const {username, email, password, confirmPass} = req.body
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const profileImgUrl = "https://i.pinimg.com/736x/1c/43/4d/1c434d1640f9572e2ac7be5c6bac9348.jpg";

    try{
        if(!username || !email || !password || !confirmPass){
            return res.status(400).json({message: "Please enter all information."})
        }
        if(username.length > 15){
            return res.status(400).json({message: "The username must not exceed 15 characters."})
        }
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format."})
        }
        if(!passwordRegex.test(password)){
            return res.status(400).json({message: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."})
        }
        if(password !== confirmPass){
            return res.status(400).json({message: "Password mismatch."})
        }
        //check username
        const checkUsername = "SELECT username FROM user_table WHERE username = ?";
        const [usernameInDB] = await pool.execute(checkUsername, [username])
        if(usernameInDB.length >= 1){
            return res.status(400).json({message: "This username already exists."});
        }
        //check email
        const checkEmail = "SELECT username FROM user_table WHERE email = ?";
        const [checkEmailInDB] = await pool.execute(checkEmail, [email])
        if(checkEmailInDB.length >= 1){
            return res.status(400).json({message: "This email already exists."});
        }

        //create user
        const salt = await bcrypt.genSalt(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        const sqlQuery = "INSERT INTO user_table(userId, profileImg, username, email, password) VALUES(?, ?, ?, ?, ?)";
        const [result] = await pool.execute(sqlQuery,[uuidv4(), profileImgUrl, username, email, hashPassword])
        
        return res.status(201).json({message: "Successful registration."})
    }catch(err){
        console.log(err)
    }
}

const loginController = async(req, res)=>{
    const {email, password} = req.body

    try{
        if(!email || !password){
            return res.status(400).json({message: "Please enter all information."})
        }
        const findUser = "SELECT userId, username, profileImg, password FROM user_table WHERE email = ?";
        const [result] = await pool.execute(findUser, [email])
        if(result.length === 0){
            return res.status(401).json({message: "Invalid email or password."})
        }
        const checkPassword = await bcrypt.compare(password, result[0].password)
        if(!checkPassword){
            return res.status(401).json({message: "Invalid email or password."})
        }
        const token = jwt.sign({userId: result[0].userId, usrename: result[0].username, profileImg: result[0].profileImg}, process.env.JWT_SECRET, {expiresIn: "1h"})
        return res.cookie("token", token, {httpOnly: true}).status(200).json({message: "Login successful.", token})
    }catch(err){
        console.log(err)
    }
}

const checkToken = async(req, res)=>{
    try{
        return res.json({status: true})
    }catch(err){
        console.log(err)
    }
}

module.exports = {registerController, loginController, checkToken};