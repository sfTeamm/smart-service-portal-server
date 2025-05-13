const Class = require('../models/Class')
const Student = require("../models/Student");
const Schedule = require("../models/Schedule")

module.exports = {

    // getAllClasses: async (req, res) => {
    //     try {
    //       const classes = await Class.find();
      
    //       res.status(200).json({
    //         success: true,
    //         message: "Successfully retrieved all classes.",
    //         data: classes,
    //       });
    //     } catch (err) {
    //       console.log("Getting all classes error:", err);
    //       res.status(500).json({
    //         success: false,
    //         message: "Server error in getting all classes.",
    //       });
    //     }
    //   },


    getAllClasses: async (req, res) => {
  try {
    const classesWithCounts = await Class.aggregate([
      {
        $lookup: {
          from: "students", 
          localField: "_id",
          foreignField: "class",
          as: "students"
        }
      },
      {
        $addFields: {
          studentCount: { $size: "$students" }
        }
      },
      {
        $project: {
          class_name: 1,
          class_num: 1,
          createdAt: 1,
          studentCount: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Successfully retrieved all classes with student count.",
      data: classesWithCounts,
    });
  } catch (err) {
    console.log("Getting all classes error:", err);
    res.status(500).json({
      success: false,
      message: "Server error in getting all classes.",
    });
  }
},



    createClass: async(req,res) =>{
         try{
            const newClass = new Class({
                class_name: req.body.class_name,
                class_num : req.body.class_num,
            })
            await newClass.save();
            res.status(200).json({success:true, message:"Successfully created the class."})
         } catch (err){
            res.status(500).json({success:false, message: "Server Error in creating Class."})
         }
    },

    updateClassWithId: async(req,res) =>{
        try{
            let id = req.params.id;
            await Class.findOneAndUpdate({_id:id}, {$set:{...req.body}});
            const classAfterUpdate = await Class.findOne({_id:id});

           res.status(200).json({success:true, message:"Successfully updated the class."})
        } catch (err){
            console.log("update class error", err)
           res.status(500).json({success:false, message: "Server Error in updating Class."})
        }
   },

   deleteClassWithId: async (req, res) => {
    try {
      const id = req.params.id;
  
      const classScheduleCount = await Schedule.countDocuments({ class: id });
  
      if (classScheduleCount > 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete class. It is currently in use.",
        });
      }
  
      const deletedClass = await Class.findOneAndDelete({ _id: id });
  
      if (!deletedClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found with the provided ID.",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Successfully deleted the class.",
        data: deletedClass,
      });
  
    } catch (err) {
      console.error("Delete class error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while deleting class.",
      });
    }
  },

  getClassStudentCounts: async (req, res) => {
    try {
      const studentCounts = await Student.aggregate([
        {
          $match: { class: { $ne: null } }
        },
        {
          $group: {
            _id: "$class",
            studentCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "classes",
            localField: "_id",
            foreignField: "_id",
            as: "classDetails"
          }
        },
        {
          $unwind: "$classDetails"
        },
        {
          $project: {
            _id: 0,
            classId: "$classDetails._id",
            class_name: "$classDetails.class_name",
            class_num: "$classDetails.class_num",
            studentCount: 1
          }
        }
      ]);

      res.status(200).json({
        success: true,
        message: "Student count per class retrieved.",
        data: studentCounts
      });
    } catch (err) {
      console.error("Error getting student count per class:", err);
      res.status(500).json({
        success: false,
        message: "Server error while getting student counts per class."
      });
    }
  },
  
  

}