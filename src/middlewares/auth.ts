import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';

import config from '../config/config';
import User, { IUser } from '../models/user';
import { Token } from '../services/jwt';

export async function authorized(req: Request, res: Response, next: Function) {
  if (!req.headers.authorization) return res.status(400).send({ message: "Client has not sent Token" });

  const token = req.headers.authorization.replace(/['"]+/g, "").split(" ")[1];

  if (token === "null") return res.status(403).send({ message: "The user does not have the necessary credentials for this operation" });

  try {
    var payload: Token = <Token>verify(token, <Secret>config.KEY.SECRET);
    const user: IUser | null = await User.findById(payload.sub);

    if (
      !user ||
      payload?.nickname !== user.nickname ||
      <number>payload?.exp <= dayjs().unix()
    ) return res.status(423).send({ message: "Access denied" });

    delete payload.iat;
    delete payload.exp;
  } catch {
    return res.status(409).send({ message: "Error decrypting token" });
  }

  req.user = <IUser>{
    _id: payload.sub,
    nickname: payload.nickname,
    role: payload.role,
  };

  return next();
}

export async function authAdmin(req: Request, res: Response, next: Function) {
  if (req.user && req.user.role & config.ALLOW.ADMIN) return next();

  if (!req.headers.authorization) return res.status(400).send({ message: "Client has not sent Token" });

  const token = req.headers.authorization.replace(/['"]+/g, "").split(" ")[1];

  if (token === "null") return res.status(403).send({ message: "The user does not have the necessary credentials for this operation" });

  try {
    var payload: Token = <Token>verify(token, <Secret>config.KEY.SECRET);
    const user: IUser | null = await User.findById(payload.sub);

    if (
      !user ||
      user.role ^ config.ALLOW.ADMIN ||
      payload?.nickname !== user.nickname ||
      payload?.role ^ config.ALLOW.ADMIN ||
      <number>payload?.exp <= dayjs().unix()
    ) return res.status(423).send({ message: "Access denied" });

    delete payload.iat;
    delete payload.exp;
  } catch {
    return res.status(409).send({ message: "Error decrypting token" });
  }

  req.user = <IUser>{
    _id: payload.sub,
    nickname: payload.nickname,
    role: payload.role,
  };

  return next();
}
