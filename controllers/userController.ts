import { Response, Request } from "express";

import UserModel from "../models/UserModel";

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  console.log("Fetching current user with ID:", userId);
  // Check if userId is present
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Fetch the user from the database
  try {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Current user fetched successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error on the server" });
  }
};
