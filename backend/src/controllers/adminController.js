import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

const generateAdminToken = (id) => {
  return jwt.sign(
    { id, role: "admin" },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateAdminToken(admin._id);

    res.json({
      success: true,
      token,
      admin: {
        _id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PASSWORD -- only for development purposes
// export const updateAdminPassword = async (req, res) => {
//   try {
//     const { newPassword } = req.body;

//     const admin = await Admin.findById("6a0eab09e444ddd8b8ebf4e6");

  

//     admin.password = newPassword;

//     await admin.save();

//     res.json({
//       success: true,
//       message: "Password updated successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// PROFILE
export const getAdminProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};