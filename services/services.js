const jwt = require('jsonwebtoken')

const generateToken = (data)=>{
    let secretKey = process.env.JWT_SECRET_KEY
    const token = jwt.sign(data, secretKey)
    return token;
}

 module.exports = {generateToken}