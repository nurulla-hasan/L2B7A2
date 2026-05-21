import { Router } from "express";

const router = Router();

router.post("/signup", (req, res) => {console.log("signup")});
router.post("/login", (req, res) => {console.log("login")});

export const authRoute = router;