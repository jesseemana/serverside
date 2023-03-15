const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(!authHeader?.startsWith('Bearer ')) return res.status(401).json({message: 'Unauthorized'})

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESSTOKEN,
        async function(err, decoded) {
            if(err) return res.status(403).json({message: 'Forbiden'})

            req.user = decoded.id 
            next()
        }
    )
}

module.exports = {verifyJWT}