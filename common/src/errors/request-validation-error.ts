import {ValidationError} from "express-validator";

import {CustomError} from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const formattedErrors = this.errors.map(error => ({
      message: error.msg,
      field: error.type === 'field' ? error.path : undefined
    }));

    return formattedErrors;
  }
}