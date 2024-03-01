import { getUserById, getUserSessionToken } from "../db/users";
import express from "express";
import { get, merge } from "lodash";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies[process.env.COOKIE];
    if (!sessionToken) {
      return res.status(403).send("No session token");
    }
    const existingUser = await getUserSessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).send("Invalid session token");
    }
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(403).send("User id not specified");
    }

    const currentUserId = get(req, 'identity._id') as string;
    if(!currentUserId) {
      return res.status(403).send("User not logged in");
    }

    if(currentUserId.toString() !== id) {
      return res.status(403).send("User not authorized");
    }

    return next();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}
