import jwt from 'jsonwebtoken';
import {Router, Request, Response} from 'express';
import {BadRequestError, validateRequest} from '@vkorg/ticketing-common';

import {User} from '../../models';
import {Password} from '../../services';

import {validationHandlers} from './validations';

const router = Router();

router.post(
  '/api/users/signin',
  validationHandlers,
  validateRequest,
  async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordsMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!isPasswordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      {id: existingUser.id, email: existingUser.email},
      process.env.JWT_KEY!
    );

    req.session = {jwt: userJwt};

    res.status(201).send(existingUser);
  }
);

export {router as signInRouter};