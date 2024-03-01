import express from "express";
import {
  deleteUserById,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUserById,
} from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.status(200).send(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).send("Username is required");
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

  
    user.username = username;
    await user.save();

    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
