import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from '../utils/helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(403).send("Please provide all the required fields");
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(403).send("Email already exists");
    }

    const salt = random();

    const user = await createUser({
      email,
      username,
      authentication: {
        password: authentication(salt, password),
        salt,
        sessionToken: random(),
      },
    });

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).send("Please provide all the required fields");
    }

    const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");
    if (!user) {
      return res.status(403).send("Invalid email or password");
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(403).send("Invalid email or password");
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString())
    await user.save();

    res.cookie(process.env.COOKIE, user.authentication.sessionToken, {domain: 'localhost', path: '/'})

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};
