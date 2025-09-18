export type WithMeta<T> = {
  data: T
  meta: {
    page: number
    total: number
  }
};

export function standardResponse<T>(value: T|{data: T[]}, code: string = 'OK', message: string = 'Success') {
  if (JSON.stringify(value).startsWith('[')) {
    value = {data: value} as {data: T[]}
  }
  return {code, message, value}
}