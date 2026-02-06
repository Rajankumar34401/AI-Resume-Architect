import express from "express";
import {
  optimizeSummary,
  atsScore,
  generateCoverLetter,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/optimize-summary", optimizeSummary);
router.post("/ats-score", atsScore);
router.post("/generate-cover-letter", generateCoverLetter);

export default router;
