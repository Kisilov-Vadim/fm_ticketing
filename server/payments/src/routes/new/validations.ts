import {body} from "express-validator";

export const validations = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty()
];