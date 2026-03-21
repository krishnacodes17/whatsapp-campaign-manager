const express = require("express");
const upload = require("../middlewares/upload");
const {uploadMembers } = require("../controllers/member.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {getMember ,getMemberState} = require("../controllers/member.controller");

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadMembers);
router.get("/", authMiddleware, getMember);
router.get("/stats", authMiddleware, getMemberState);


module.exports = router;