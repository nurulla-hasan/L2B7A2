import { Router } from "express";
import auth from "../../middleware/auth";
// import role from "../../middleware/role";
import { issueController } from "./issue.controller";

const router = Router();







router.get("/", issueController.getAllIssues);

router.get("/:id", issueController.getSingleIssue);

router.post("/", auth, issueController.createIssue);

router.patch("/:id", auth, issueController.updateIssue);

// router.delete("/:id", auth, role("maintainer"), issueController.deleteIssue);




export const issueRoute = router;
