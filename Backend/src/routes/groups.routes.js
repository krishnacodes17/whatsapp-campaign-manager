const express = require("express")

const authMiddelware = require("../middlewares/auth.middleware")
const {createGroup , getGroup, deleteGroup , updateGroup} = require("../controllers/group.controller")
const router = express.Router()

router.post("/",authMiddelware ,createGroup )
router.get("/",authMiddelware,getGroup)
router.delete("/:id", authMiddelware , deleteGroup)
router.put("/:id", authMiddelware, updateGroup);


module.exports = router