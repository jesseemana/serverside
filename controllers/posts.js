const Post = require('../model/Post')
const User = require('../model/User')


async function getFeedPosts(req, res) {
    const post = await Post.find()
    res.status(200).json(post)
}


async function getUserPosts(req, res) {
    const {userId} = req.params
    // GET A USERS' POSTS WITH THEIR ID 
    const post = await Post.find({userId})
    res.status(201).json(post)
}


async function createPost(req, res) {
    const {userId, description, picturePath} = req.body
    if(!userId || !description || !picturePath) return res.status(400).json({message: 'Please provide all fields'})

    const user = await User.findById(userId)
    if(!user) return res.status(400).json({message: 'User not found'})

    const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes: {},
        comments: []
    })

    await newPost.save()

    // WE HAVE TO RETURN ALL POSTS TO THE FRONTEND 
    const post = await Post.find()

    res.status(201).json(post)
}


async function likePosts(req, res) {
    const {id} = req.params
    const {userId} = req.body
    if(!id || !userId) return res.status(400).json({message: 'Provide post Id and userId'})

    const post = await Post.findById(id)
    if(!post) return res.status(400).json({message: 'Post does not exist'})

    const isLiked = post.likes.get(userId)

    if(isLiked) {
        post.likes.delete()
    } else {
        post.likes.set(userId, true)
    }

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {likes: post.likes},
        {new: true}
    )

    res.status(200).json(updatedPost)
}


module.exports = {
    createPost,
    getFeedPosts,
    getUserPosts,
    likePosts
}