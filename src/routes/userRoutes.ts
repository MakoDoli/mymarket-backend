import { Router } from "express";
import {
  signUp,
  signIn,
  //verifyEmail,
  resetPassword,
  verifyEmail,
} from "../controllers/userContoller";
import { validateRequest } from "../middleware/validateRequest";
import {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
} from "../validators/userValidators";

const router = Router();

router.post("/signup", validateRequest(signUpSchema), signUp);
router.post("/signin", validateRequest(signInSchema), signIn);
router.get("/verify-email/:token", verifyEmail);
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);

export default router;
