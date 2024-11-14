const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config()

const passport = require('passport')
const session = require('express-session')
require('./passportSetup')

const authRoute = require('./routes/authRoute')
const oauthRoute = require('./routes/oauthRoute')
const userRoute = require('./routes/userRoute')
const blogRoute = require('./routes/blogRoute')
const commentRoute = require('./routes/commentRoute')
const searchRoute = require('./routes/searchRoute')


const app = express()

app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173']
}))
// app.use(bodyParser.json({limit: '30mb', extended: true}))
// app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(morgan('dev'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/',authRoute)
app.use('/', oauthRoute)
app.use('/', userRoute)
app.use('/', blogRoute)
app.use('/', commentRoute)
app.use('/', searchRoute)

const PORT = 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})

app.use(express.static(path.join(__dirname, "../frontend/dist")))
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"))
})