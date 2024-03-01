import { isAuthenticated, isOwner } from "../middlewares";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import express from "express";

const router = express.Router();

router.get("/", isAuthenticated, getAllUsers);
router.delete("/:id", isAuthenticated, isOwner, deleteUser);
router.patch("/:id", isAuthenticated, isOwner, updateUser);

export default router;
