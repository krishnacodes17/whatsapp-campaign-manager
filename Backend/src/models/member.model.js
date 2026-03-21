const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    status: {
      type: String,
      enum: ["pending", "invited", "joined", "opted_out"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);