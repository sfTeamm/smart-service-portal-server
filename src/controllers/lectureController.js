const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Lecture = require("../models/Lecture");
const Class = require("../models/Class"); 

module.exports = {
registerLecture: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
  
    try {
      const { name, email, gender, role, class: className, password } = req.body;
  
      if (!name || !email || !gender || !role || !className || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      const existingLecture = await Lecture.findOne({ email: email.trim() });
      if (existingLecture) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password.trim(), salt);

      const newLecture = new Lecture({
        name: name.trim(),
        email: email.trim(),
        gender: gender.trim(),
        role: "lecture",  
        class: className.trim(),
        password: hashedPassword,
      });
  
      await newLecture.save();
      return res.status(201).json({ success: true, message: "Lecture registered successfully" });
  
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ success: false, message: "Server error during registration", error: error.message });
    }
  },
  

  loginLecture: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }

      const lecture = await Lecture.findOne({ email: email.trim() });
      if (!lecture) {
        return res.status(401).json({ success: false, message: "Incorrect email" });
      }

      const isMatch = await bcrypt.compare(password.trim(), lecture.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      const token = jwt.sign(
        {
          id: lecture._id,
          name: lecture.name,
          email: lecture.email,
          role: lecture.role,
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
          id: lecture._id,
          name: lecture.name,
          email: lecture.email,
          gender: lecture.gender,
          class: lecture.class,  
          role: lecture.role,
        },
      });
    } catch (err) {
      console.error("Lecture login error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getAllLectures: async (req, res) => {
    try {
      const lectures = await Lecture.find().populate("class").select("-password");
      return res.status(200).json({ success: true, message: "Fetched all lectures", data: lectures });
    } catch (err) {
      console.error("Fetch lectures error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  getLectureOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const lecture = await Lecture.findById(id).populate("class").select("-password");
      if (!lecture) {
        return res.status(404).json({ success: false, message: "Lecture not found" });
      }
      return res.status(200).json({ success: true, message: "Fetched lecture data", data: lecture });
    } catch (err) {
      console.error("Fetch lecture error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  updateLectureById: async (req, res) => {
    try {
      const lectureId = req.params.id;
      let { password, ...updateData } = req.body;

      if (password && password.trim()) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password.trim(), salt);
      }

      if (updateData.class) {
        const classExists = await Class.findById(updateData.class);
        if (!classExists) {
          return res.status(404).json({ success: false, message: "Class not found" });
        }
      }

      const updatedLecture = await Lecture.findByIdAndUpdate(
        lectureId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate("class").select("-password");

      if (!updatedLecture) {
        return res.status(404).json({ success: false, message: "Lecture not found" });
      }

      return res.status(200).json({ success: true, message: "Lecture updated", data: updatedLecture });
    } catch (err) {
      console.error("Update lecture error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  deleteLectureById: async (req, res) => {
    try {
      const lectureId = req.params.id;
      const deletedLecture = await Lecture.findByIdAndDelete(lectureId);
      if (!deletedLecture) {
        return res.status(404).json({ success: false, message: "Lecture not found" });
      }
      return res.status(200).json({ success: true, message: "Lecture deleted", data: deletedLecture });
    } catch (err) {
      console.error("Delete lecture error:", err);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

    getLectureClass: async (req, res) => {
      try {
        const lectureId = req.params.id;
  
        const lecture = await Lecture.findById(lectureId).populate("class");
  
        if (!lecture) {
          return res.status(404).json({
            success: false,
            message: "Lecture not found.",
          });
        }
  
        if (!lecture.class) {
          return res.status(404).json({
            success: false,
            message: "No class assigned to this lecture.",
          });
        }
  
        return res.status(200).json({
          success: true,
          message: "Class retrieved for lecture.",
          data: lecture.class,
        });
      } catch (err) {
        console.error("Get lecture class error:", err);
        return res.status(500).json({
          success: false,
          message: "Server error retrieving class.",
        });
      }
    },
};
