import { ResponseModel } from "@nextjs-expressjs-postgresql/shared/models/response.model";

export function createResponse<T = undefined>(status:ResponseModel<T>['status'], data?: T, message?: string): ResponseModel<T> {
  return { status, data, message };
}