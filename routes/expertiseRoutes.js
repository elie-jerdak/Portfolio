const express = require("express");
const router = express.Router();

const asyncHandler = require("../middleware/asyncHandler");
const expertiseController = require("../controllers/expertiseController");

router.get("/", asyncHandler(expertiseController.getExpertisePage));
router.get("/api/technologies", asyncHandler(expertiseController.getTechnologies));
router.get("/api/stats", asyncHandler(expertiseController.getExperienceStats));

module.exports = router;