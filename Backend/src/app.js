const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieParser())


const authRoutes = require("./routes/authRoutes")
const groupsRoutes = require("./routes/groups.routes")
const memberRoutes = require("./routes/member.routes")
const inviteRoutes = require("./routes/invite.routes");

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRoutes)
app.use("/api/groups",groupsRoutes)
app.use("/api/members", memberRoutes);
app.use("/api/invites", inviteRoutes);





module.exports = app