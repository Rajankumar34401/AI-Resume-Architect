import type { Request, Response } from 'express';
import User from '../models/user.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const newUser = new User({ email, password }); // Hash password in real apps!
    await newUser.save();
    
    res.status(201).json({ userId: newUser._id, isPro: newUser.isPro });
  } catch (error) {
    res.status(500).json({ message: "Signup error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    res.status(200).json({ userId: user._id, isPro: user.isPro });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};