const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')


async function login(req, res) {
    const {email, password} = req.body

    if(!email || !password)
        return res.status(400).json({message: "Please fill all fields."})

    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message: 'User does not exist.'})

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(400).json({message: 'Invalid user credentials.'})

    const accessToken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN)
    
    res.status(200).json({user, accessToken})
}


module.exports = {login}