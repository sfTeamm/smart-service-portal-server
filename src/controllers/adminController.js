const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Admin = require("../models/Admin");

module.exports = {
  registerAdmin: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, gender, phone, password } = req.body;

      if (!name || !email || !gender || !phone || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      const existingAdmin = await Admin.findOne({ email: email.trim() });
      if (existingAdmin) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password.trim(), salt);

      const newAdmin = new Admin({
        name: name.trim(),
        email: email.trim(),
        gender: gender.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role: 'admin',
      });

      await newAdmin.save();
      return res.status(201).json({ success: true, message: "Admin registered successfully" });

    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ success: false, message: "Server error during registration", error: error.message });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }

      const admin = await Admin.findOne({ email: email.trim() });
      if (!admin) {
        return res.status(401).json({ success: false, message: "Incorrect email" });
      }

      const isMatch = await bcrypt.compare(password.trim(), admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      const token = jwt.sign(
        {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
        process.env.JWT_SECRET || "defaultSecret",
        { expiresIn: "1h" }
      );

      res.header("Authorization", token);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          gender: admin.gender,
          phone: admin.phone, 
          role: admin.role,
        },
      });
    } catch (err) {
      console.error("Admin login error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getAllAdmins: async (req, res) => {
    try {
      const admins = await Admin.find().select("-password");
      return res.status(200).json({ success: true, message: "Fetched all admins", data: admins });
    } catch (err) {
      console.error("Fetch admins error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getAdminOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const admin = await Admin.findById(id).select("-password");
      if (!admin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
      return res.status(200).json({ success: true, message: "Fetched admin data", data: admin });
    } catch (err) {
      console.error("Fetch admin error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  updateAdminById: async (req, res) => {
    try {
      const adminId = req.params.id;
      let { password, ...updateData } = req.body;

      if (password && password.trim()) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password.trim(), salt);
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedAdmin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }

      return res.status(200).json({ success: true, message: "Admin updated", data: updatedAdmin });
    } catch (err) {
      console.error("Update admin error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  deleteAdminById: async (req, res) => {
    try {
      const adminId = req.params.id;
      const deletedAdmin = await Admin.findByIdAndDelete(adminId);
      if (!deletedAdmin) {
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
      return res.status(200).json({ success: true, message: "Admin deleted", data: deletedAdmin });
    } catch (err) {
      console.error("Delete admin error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
};
