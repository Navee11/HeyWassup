import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import express from "express";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  console.log(req.body);
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing details" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Before User.create");
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    console.log("After User.create");
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfullly",
    });
    console.log("After generateToken");
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//conroller to login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    const isPassword = await bcrypt.compare(userData.password);

    if (!isPassword) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = generateToken(userData._id);
    return res.json({
      success: true,
      userData,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true },
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true },
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
