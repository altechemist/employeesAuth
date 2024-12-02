const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  addEmployee,
  loginUser,
  registerUser,
  resetEmail,
} = require("../controllers/db");

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Create multer instance

// Define routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/addEmployee", upload.single("imageFile"), addEmployee);
router.post("/resetEmail", resetEmail);
router.get("/getAllEmployees", getAllEmployees);
router.get("/getEmployee/:id", getEmployee);
router.put("/updateEmployee/:id", upload.single("imageFile"), updateEmployee);
router.delete("/deleteEmployee/:id", deleteEmployee);

// Export the router
module.exports = router;
