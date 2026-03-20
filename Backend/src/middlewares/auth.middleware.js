const jwt = require("jsonwebtoken")

const authMiddelware = (req,res,next){
    try {
        const  token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"unauthorized - no token"
            })
        }

        const decode = jwt.verify(token , process.env.JWT_SECRET)

        req.user = decode;

        next()

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"unauthorized - invalid token"
        })
    }
}

module.exports = authMiddelware