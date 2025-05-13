const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Student = require("../models/Student");

module.exports = {
  registerStudent: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const {
        name,
        student_num,
        email,
        gender,
        role,
        class: className,
        password,
      } = req.body;

      if (!name || !student_num || !email || !gender || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required except class",
        });
      }

      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password.trim(), salt);

      const newStudent = new Student({
        name: name.trim(),
        student_num: student_num.trim(),
        email: email.trim(),
        gender: gender.trim(),
        role: "student",
        password: hashedPassword,
      });

      if (className && className.trim()) {
        newStudent.class = className.trim();
      }

      await newStudent.save();
      return res
        .status(201)
        .json({ success: true, message: "Student registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error during registration",
        error: error.message,
      });
    }
  },

  loginStudent: async (req, res) => {
    try {
      const { email, password } = req.body;

      const foundStudent = await Student.findOne({ email: email.trim() });
      if (!foundStudent) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect email" });
      }

      const isAuth = await bcrypt.compare(
        password.trim(),
        foundStudent.password
      );
      if (!isAuth) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }

      const token = jwt.sign(
        {
          id: foundStudent._id,
          name: foundStudent.name,
          student_num: foundStudent.student_num,
          role: foundStudent.role,
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
          id: foundStudent._id,
          name: foundStudent.name,
          student_num: foundStudent.student_num,
          role: foundStudent.role,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find().select("-password");
      return res.status(200).json({
        success: true,
        message: "Fetched all students",
        data: students,
      });
    } catch (err) {
      console.error("Fetch students error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getStudentOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const student = await Student.findById(id).select("-password");
      if (!student) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Fetched student data",
        data: student,
      });
    } catch (err) {
      console.error("Fetch student error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  // updateStudentWithId: async (req, res) => {
  //   try {
  //     const studentId = req.params.id;
  //     let { password, ...updateData } = req.body;

  //     if (password && password.trim()) {
  //       const salt = bcrypt.genSaltSync(10);
  //       updateData.password = bcrypt.hashSync(password.trim(), salt);
  //     }

  //     const updatedStudent = await Student.findByIdAndUpdate(
  //       studentId,
  //       { $set: updateData },
  //       { new: true, runValidators: true }
  //     ).select("-password");

  //     if (!updatedStudent) {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "Student not found" });
  //     }

  //     return res.status(200).json({
  //       success: true,
  //       message: "Student updated",
  //       data: updatedStudent,
  //     });
  //   } catch (err) {
  //     console.error("Update student error:", err);
  //     return res
  //       .status(500)
  //       .json({ success: false, message: "Internal server error" });
  //   }
  // },


  updateStudentWithId: async (req, res) => {
  try {
    const studentId = req.params.id;
    let { password, class: newClassId, ...updateData } = req.body;

    if (newClassId) {
      const studentCount = await Student.countDocuments({ class: newClassId });

      if (studentCount >= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign student. Class is already full (50 students).",
        });
      }

      updateData.class = newClassId; 
    }
    if (password && password.trim()) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password.trim(), salt);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated",
      data: updatedStudent,
    });

  } catch (err) {
    console.error("Update student error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
},

  deleteStudentWithId: async (req, res) => {
    try {
      const studentId = req.params.id;
      const deletedStudent = await Student.findByIdAndDelete(studentId);
      if (!deletedStudent) {
        return res
          .status(404)
          .json({ success: false, message: "Student not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Student deleted",
        data: deletedStudent,
      });
    } catch (err) {
      console.error("Delete student error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
