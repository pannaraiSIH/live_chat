import mongoose from "mongoose";
import { hash, genSalt, compare } from "bcrypt";

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
  },
  { timestamps: true, versionKey: "__v" }
);

userSchema.pre("save", async function (next) {
  const salt = await genSalt(10);
  const hashedPassword = await hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (incomingPassword) {
  return await compare(incomingPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
