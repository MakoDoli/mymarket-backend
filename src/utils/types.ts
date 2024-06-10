import { Request, Response } from "express";

export interface CustomRequest extends Request {
  cookies: { [key: string]: string };
  user?: any;
}

interface ResponseWithClearCookie extends Response {
  clearCookie(name: string, options?: any): this;
}

export interface CustomResponse extends ResponseWithClearCookie {
  clearCookie(name: string, options?: any): this;
}

export interface CustomResponseWithThis extends CustomResponse {
  this: this; // This line is important
}

export type CustomResponseType<
  LocalsObject extends Record<string, any> = Record<string, any>
> = CustomResponseWithThis & Response<any, LocalsObject>;
