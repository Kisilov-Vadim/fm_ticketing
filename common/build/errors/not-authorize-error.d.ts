import { CustomError } from "../errors";
export declare class NotAuthorizeError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
