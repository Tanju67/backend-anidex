import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  authMethod: "local" | "google";
  googleId?: string;
  comparePassword: (canditatePassword: string) => Promise<boolean>;
  createJWT: () => string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your full name"],
      minlength: [4, "Full name must be at least 4 characters"],
      maxlength: [50, "Full name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: [true, "Email already exists"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
      minlength: [6, "Password must be at least 6 characters"],
    },

    authMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,

      sparse: true,
      unique: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  canditatePassword: string,
) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

userSchema.methods.createJWT = function () {
  const secret = process.env.JWT_SECRET;
  const lifetime = process.env.JWT_LIFETIME as jwt.SignOptions["expiresIn"];

  if (!secret || !lifetime) {
    throw new Error("JWT_SECRET or JWT_LIFETIME_IN_SEC is not defined");
  }

  const payload = {
    userId: this._id.toString(),
    fullName: this.fullName,
    email: this.email,
  };

  return jwt.sign(payload, secret, {
    expiresIn: lifetime,
  });
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
