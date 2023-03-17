const express = require('express')
const router = express.Router()
const postsController = require('../controllers/posts')
const verifyJWT = require('../middleware/auth')

router.use(verifyJWT)

router.route('/')
    .get(postsController.getFeedPosts)

router.route('/:userId/posts')
    .get(postsController.getUserPosts)

router.route('/:id/like')
    .patch(postsController.likePosts)

module.exports = router