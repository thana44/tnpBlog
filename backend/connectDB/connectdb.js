const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 20, //จำนวนคนที่สามารถเชื่อมต่อ db
    queueLimit: 100 //คิวที่สามารถรอได้เมื่อคนเชื่อมต่อเกิน 20
})

module.exports = pool;