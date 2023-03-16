const bcrypt = require('bcrypt')
const User = require('../model/User')



async function registerUser(req, res) {
    const {firstName, lastName, email, password, picturePath, friends, location, occupation} = req.body;

    if(!firstName || !lastName || !email || !password || !location || !occupation) {
        return res.status(400).json({message: "Please fill all fields"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
    });

    const user = await newUSer.save();

    if(user) {
        return res.status(201).json({message: `User ${user.firstName} ${user.lastName} has been created`});
    } else {
        return res.status(400).json({message: 'Invalid credentials provided'});
    }
}



async function getUsers(req, res) {
    const users = await User.find()
    if(!users) return res.status(400).json({message: 'User does not exist'})
    res.status(200).json(users)
}



async function getUser(req, res) {
    const {id} = req.params
    if(!id) return res.status(400).json({message: 'Please provide a user ID'})

    const user = await User.findById(id)
    if(!user) return res.status(400).json({message: 'User does not exist'})

    res.status(200).json(user)
}



async function getUSerFriends(req, res) {
    const {id} = req.params
    if(!id) return res.status(400).json({message: 'Please provide a user ID'})

    const user = await User.findById(id)
    if(!user) return res.status(400).json({message: 'User does not exist'})

    const userFriends = await Promise.all(
        user.friends.map(id => User.findById(id))
    )

    const formattedFriends = userFriends.map(
        ({_id, firstName, lastName, occupation, picturePath}) => {
            return {_id, firstName, lastName, occupation, picturePath}
        }
    )

    res.status(200).json(formattedFriends)
}



async function addRemoveFriend(req, res) {
    const {id, friendId} = req.params
    if(!id || !friendId) return res.status(400).json({message: `Please provide a user ID and friends' ID`})

    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    if(!user || !friend) return res.status(400).json({message: 'User or friend does not exist'})

    if(user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId)
        friend.friends = friend.friends.filter((id) => id !== id)
    } else {
        user.friends.push(friendId)
        friend.friends.push(id)
    }

    await user.save()
    await friend.save()

    const userFriends = await Promise.all(
        user.friends.map(id => User.findById(id))
    )

    const formattedFriends = userFriends.map(
        ({_id, firstName, lastName, occupation, picturePath}) => {
            return {_id, firstName, lastName, occupation, picturePath}
        }
    )

    res.status(200).json(formattedFriends)
}


module.exports = {
    registerUser,
    getUser,
    getUsers,
    getUSerFriends,
    addRemoveFriend,
}