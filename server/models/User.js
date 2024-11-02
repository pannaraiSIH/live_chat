import mongoose from "mongoose";
import { hash, genSalt, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      type: String,
      enum: ["bear", "dinosaur", "ladybug", "dragonfly"],
    },
    onlineStatus: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: "__v" }
);

userSchema.pre("save", async function (next) {
  const salt = await genSalt(10);
  const hashedPassword = await hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

userSchema.methods.comparePassword = async function (incomingPassword) {
  return await compare(incomingPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
