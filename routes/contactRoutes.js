const express = require("express");
const router = express.Router();

const asyncHandler = require("../middleware/asyncHandler");
const contactController = require("../controllers/contactController");

//return html page for projects
router.get("/", asyncHandler(contactController.getContactPage));

// contactRoutes.js
router.post("/api/send", asyncHandler(contactController.sendMessage));

module.exports = router;