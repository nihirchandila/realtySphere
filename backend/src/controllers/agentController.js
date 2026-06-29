import Agent from "../models/Agent.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const registerAgent = async (req, res) => {
  try {
    const { name, email, phone, password, agencyName, city } = req.body;

    const exists = await Agent.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Agent already exists",
      });
    }

    const agent = await Agent.create({
      name,
      email,
      phone,
      password,
      agencyName,
      city,
    });

    res.status(201).json({
      success: true,
      message: "Agent registered",
      token: generateToken(agent._id),
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        agencyName: agent.agencyName,
        city: agent.city,
        role: agent.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Login
export const loginAgent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email });

    if (!agent || !(await agent.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      token: generateToken(agent._id),
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        agencyName: agent.agencyName,
        city: agent.city,
        role: agent.role,
      },

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const agent = await Agent.findById(req.agent._id);

    const isMatch = await agent.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    agent.password = newPassword;
    await agent.save();

    res.json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select("-password");

    res.json({
      success: true,
      agents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View one
export const getSingleAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (!agent) {
      return res.status(404).json({
        message: "Agent not found",
      });
    }

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateAgent = async (req, res) => {
  try {
    const updated = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
export const deleteAgent = async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Agent deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// for agent dashboard auth
export const getAgentProfile = async (req, res) => {
  try {
    res.json({ success: true, agent: req.agent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};