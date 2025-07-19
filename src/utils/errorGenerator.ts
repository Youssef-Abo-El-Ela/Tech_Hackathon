export class ErrorGenerator extends Error {
    statusCode: number;
    constructor(message: string = "Internal server error", statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}