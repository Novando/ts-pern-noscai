import type {Response} from "express";

export type WithMeta<T> = {
  data: T
  meta: {
    page: number
    total: number
  }
};

export function standardResponse<T>(
  res: Response,
  code: number,
  value: T|{data: T[]},
  resCode: string = 'OK',
  message: string = 'Success',
) {
  if (JSON.stringify(value).startsWith('[')) {
    value = {data: value} as {data: T[]}
  }
  return res.status(code).json({code: resCode, message, value})
}