const Member = require("../models/member.model");
const csv = require("csv-parser");
const fs = require("fs");

async function uploadMembers(req, res){
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {

        const members = results.map((row) => ({
          name: row.name,
          phone: row.phone,
          group: req.body.groupId,
        }));

        await Member.insertMany(members);

        res.json({
          success: true,
          message: "Members uploaded successfully",
        });
      });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



async function getMember(req,res) {
   try {
    const members = await Member.find().populate("group", "name");

    res.status(200).json({
      success: true,
      members,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


async function getMemberState(req, res){
  try {
    const total = await Member.countDocuments();

    const invited = await Member.countDocuments({ status: "invited" });
    const joined = await Member.countDocuments({ status: "joined" });

    res.json({
      success: true,
      stats: {
        total,
        invited,
        joined,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}



module.exports = {getMember ,uploadMembers, getMemberState}