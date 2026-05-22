import { Router } from "express";
import auth from "../../middleware/auth";
import { issueController } from "./issue.controller";
import role from "../../middleware/role";

const router = Router();







router.get("/", issueController.getAllIssues);

router.get("/:id", issueController.getSingleIssue);

router.post("/", auth, issueController.createIssue);

router.patch("/:id", auth, issueController.updateIssue);

router.delete("/:id", auth, role("maintainer"), issueController.deleteIssue);




export const issueRoute = router;
