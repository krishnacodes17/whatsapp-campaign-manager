const express = require("express");
const router = express.Router();

const { sendInvites } = require("../controllers/invite.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/start", authMiddleware, sendInvites);

module.exports = router;