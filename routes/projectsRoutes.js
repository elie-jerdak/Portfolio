const express = require("express");
const router = express.Router();

const asyncHandler = require("../middleware/asyncHandler");
const pageController = require("../controllers/projectsController");

//return html page for projects
router.get("/", asyncHandler(pageController.getProjectsPage));

// projectRoutes.js

router.get("/api/featured", asyncHandler(pageController.getFeaturedProjects));
router.get("/api", asyncHandler(pageController.getProjects));
router.get("/api/:id", asyncHandler(pageController.getProjectById));
router.post("/api", asyncHandler(pageController.createProject));
module.exports = router;