import { Request, Response } from "express";
import UserModel from "../models/UserModel.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// ------------ REGISTER USER ------------
export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  // hash password
  req.body.password = await hashPassword(req.body.password);

  // check if user already exists
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ message: "User already exists!" });
    }

    // create new user
    user = new UserModel(req.body);
    await user.save();

    const userWithoutPassword = await UserModel.findOne({
      email: req.body.email,
    })
      .select("-password")
      .lean(); // lean() returns a plain JS object instead of a Mongoose document

    // generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    // set token in cookie
    // res.cookie("auth_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 86400000,
    //   path: "/",
    // });

    return res.status(200).send({
      message: "Registration was successful",
      user: userWithoutPassword,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
// ------------ LOGIN USER ------------
export const loginUser = async (req: Request, res: Response) => {
  // check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  // check if user exists and password is correct
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    const isValidUser =
      user && (await comparePassword(req.body.password, user.password));

    if (!isValidUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    const userWithoutPassword = await UserModel.findOne({
      email: req.body.email,
    })
      .select("-password")
      .lean();

    // set cookie
    // res.cookie("auth_token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 86400000,
    //   path: "/",
    // });
    return res
      .status(200)
      .send({
        message: "Login successful!",
        user: userWithoutPassword,
        token: token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ------------ LOGOUT USER ------------
export const logoutUser = async (req: Request, res: Response) => {
  // clear cookie
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() - 3600), // Nastaví expiraci na čas v minulosti
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
};
