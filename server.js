require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const helmet = require("helmet")
const path = require("path")
const {fileURLToPath} = require("url")
const morgan = require('morgan');
const connectDB = require('./config/connectDB')
const {register} = require('./controllers/user')


const PORT = process.env.PORT

connectDB()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// MIDDLEWARE 
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
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
app.post('/auth/register', upload.single('picture'), register)


// ROUTES 
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))


mongoose.connection.once('open', () => {
    console.log(`Database connected...`.cyan.underline)
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}...`.cyan.underline))
})  