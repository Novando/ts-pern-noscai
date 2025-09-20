import type {Response} from "express";
import {convertTz} from "./date-converter.util";

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
  // @ts-ignore
  value = convertTz(value)
  if (JSON.stringify(value).startsWith('[')) {
    value = {data: value} as {data: T[]}
  }
  return res.status(code).json({code: resCode, message, value})
}