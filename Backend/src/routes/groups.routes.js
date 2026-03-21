const express = require("express")

const authMiddelware = require("../middlewares/auth.middleware")
const {createGroup , getGroup} = require("../controllers/group.controller")
const router = express.Router()

router.post("/",authMiddelware ,createGroup )
router.get("/",authMiddelware,getGroup)



module.exports = router