export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const notFoundError = (message: string) => new ApiError(404, message);
export const forbiddenError = (message: string) => new ApiError(403, message);
export const conflictError = (message: string) => new ApiError(409, message);
export const unauthorizedError = (message: string) =>
  new ApiError(401, message);
export const badRequestError = (message: string) => new ApiError(400, message);
