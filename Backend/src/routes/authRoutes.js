const express = require("express")
const { registerUserController, loginUserController, logoutUserController } = require("../controllers/auth.controllers")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router()

router.post("/register",registerUserController)
router.post("/login",loginUserController)
router.post("/logout",logoutUserController)


router.get("/me",authMiddleware , (req,res)=>{
    res.status(200).json({
        success:true,
        user: req.user
    })
} )



module.exports= router