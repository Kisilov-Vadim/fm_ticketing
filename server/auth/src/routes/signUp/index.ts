import jwt from 'jsonwebtoken';
import express, {Request, Response} from "express";

import {User} from "../../models";
import {BadRequestError} from "../../errors";
import {validateRequest} from '../../middlewares';

import {validationHandlers} from "./validations";

const router = express.Router();

router.post(
  "/api/users/signup",
  validationHandlers,
  validateRequest,
  async (req: Request, res: Response) => {
    const existingUser = await User.findOne({email: req.body.email});

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build(req.body);
    await user.save();

    const userJwt = jwt.sign(
      {id: user.id, email: user.email},
      process.env.JWT_KEY!
    );

    req.session = {jwt: userJwt};

    res.status(201).send(user);
  }
);

export {router as signUpRouter};
