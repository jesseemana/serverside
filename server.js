require('dotenv').config()
require('colors')
require('express-async-errors')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const helmet = require("helmet")
const path = require("path")
const {fileURLToPath} = require("url")
const morgan = require('morgan')
const connectDB = require('./config/connectDB')
const {registerUser} = require('./controllers/auth')
const verifyJWT = require('./middleware/auth')
const {createPost} = require('./controllers/posts')


const PORT = process.env.PORT || 8000

connectDB()

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express()


// MIDDLEWARE 
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan("common"))
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))


app.use("/assets", express.static(path.join(__dirname, "public/assets")))


// MULTER SETUP FOR FILE UPLOADING
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})


// USER PROFILE SETUP 
// WON'T BE IN ROUTES FOLDER BECAUSE WE WANT TO USE MULTER UPLOAD IN INDEX 
app.post('/auth/register', upload.single('picture'), registerUser)
app.post('/posts/create', verifyJWT, upload.single('picture'), createPost)


// ROUTES 
app.use('/auth', require('./routes/auth'))
app.use('/users', require('./routes/user'))
app.use('/posts', require('./routes/posts'))


mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline)
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline))
})      