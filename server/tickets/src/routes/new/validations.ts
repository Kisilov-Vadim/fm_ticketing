import {body} from 'express-validator';

export const validations = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
]