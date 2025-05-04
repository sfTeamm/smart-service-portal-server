const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminOwnData,
  updateAdminById,
  deleteAdminById,
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/all",  getAllAdmins); 
router.get("/fetch-own",  getAdminOwnData); 
router.patch("/update/:id",  updateAdminById); 
router.delete("/delete/:id",  deleteAdminById); 

module.exports = router;
