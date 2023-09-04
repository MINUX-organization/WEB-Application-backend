import express from 'express';
import { UserController } from "../controllers/userController.js";

const userRouter = express.Router()
// http://localhost:8200/api/user/user-info
userRouter.get("/user-info", UserController.userInfo)
// http://localhost:8200/api/user/login
userRouter.post("/login", UserController.login);
// http://localhost:8200/api/user/edit-name
userRouter.post("/edit-name", UserController.editName);
// http://localhost:8200/api/user/edit-password
userRouter.post("/edit-password", UserController.editPassword);
// http://localhost:8200/api/user/get-recovery-codes
userRouter.get("/get-recovery-codes", UserController.getRecoveryCodes);
// http://localhost:8200/api/user/recovery-password
userRouter.post("/recovery-password", UserController.recoveryPassword);

export { userRouter }