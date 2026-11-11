
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    company: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Lead", "Active", "Inactive"],
      default: "Lead"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
