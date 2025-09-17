export type WithMeta<T> = {
  data: T
  meta: {
    page: number
    total: number
  }
};

export function standardResponse<T>(value: T, code: string = 'OK', message: string = 'Success') {
  return {code, message, value}
}