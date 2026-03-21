const Member = require("../models/member.model");

async function sendInvites(req, res) {
  try {
    const members = await Member.find({ status: "pending" });

    for (let member of members) {
      member.status = "invited";
      await member.save();
    }

    res.json({
      success: true,
      message: "Invites sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports= {sendInvites}