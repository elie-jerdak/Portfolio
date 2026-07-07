const express = require("express");
const router = express.Router();

const asyncHandler = require("../middleware/asyncHandler");
const controller = require("../controllers/projectsController");

router.get("/", asyncHandler(controller.getProjects));
router.post("/", asyncHandler(controller.createProject));

module.exports = router;