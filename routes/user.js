const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const verifyJWT = require('../middleware/auth')

router.use(verifyJWT)

router.route('/')
    .get(userController.getUsers)

router.route('/:id')
    .get(userController.getUser)

router.route('/:id/friends')
    .get(userController.getUSerFriends)

router.route('/:id/:friendId')
    .patch(userController.addRemoveFriend)

module.exports = router