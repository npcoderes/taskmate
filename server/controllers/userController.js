import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/db.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, first_name, last_name, email, created_at",
      [firstName, lastName, email, hashedPassword]
    );

    const user = result.rows[0];
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.user_id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(
      "SELECT user_id, first_name, last_name, email, profile_pic, created_at, updated_at FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          profilePic: user.profile_pic,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const result = await db.query(
      "UPDATE users SET first_name = $1, last_name = $2 WHERE user_id = $3 RETURNING user_id, first_name, last_name, email, profile_pic, updated_at",
      [firstName, lastName, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          userId: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          profilePic: user.profile_pic,
          updatedAt: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture is required",
      });
    }

    const profilePicUrl = req.file.path;

    const result = await db.query(
      "UPDATE users SET profile_pic = $1 WHERE user_id = $2 RETURNING user_id, first_name, last_name, email, profile_pic, updated_at",
      [profilePicUrl, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        user: {
          userId: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          profilePic: user.profile_pic,
          updatedAt: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error("Update profile pic error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const userResult = await db.query(
      "SELECT password FROM users WHERE user_id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2",
      [hashedNewPassword, userId]
    );

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
