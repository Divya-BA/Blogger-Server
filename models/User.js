const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    activationToken: {
        type: String,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      randomString: String,
      randomStringExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
