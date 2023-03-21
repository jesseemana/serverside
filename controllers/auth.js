const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')



async function registerUser(req, res) {
    const {firstName, lastName, email, password, picturePath, friends, location, occupation} = req.body

    if(!firstName || !lastName || !email || !password || !location || !occupation) {
        return res.status(400).json({message: "Please fill all fields"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUSer = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        picturePath,
        friends,
        location,
        occupation,
        viewdProfile: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1000),
    })

    const user = await newUSer.save()

    if(user) {
        return res.status(201).json({message: `User ${user.firstName} ${user.lastName} has been created`})
    } else {
        return res.status(400).json({message: 'Invalid credentials provided'})
    }
}



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


module.exports = {registerUser, login}