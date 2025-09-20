import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Converts all Date objects in an object to timestamps (number)
 * @param obj The object containing Date objects to convert
 * @param timezone The timezone to use for conversion (default: 'Europe/Berlin')
 * @returns A new object with Dates converted to timestamps
 */
export function convertTz<T extends Record<string, any> | any[]>(obj: T, timezone: string = 'Europe/Berlin'): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Preserve array structure by mapping over the array
    return obj.map(item => {
      if (item instanceof Date) {
        return dayjs(item).tz('Europe/Berlin').format();
      } else if (item && typeof item === 'object') {
        return convertTz(item, timezone);
      }
      return item;
    }) as unknown as T;
  }

  const result = { ...obj };

  for (const key in result) {
    if (result[key] instanceof Date) {
      // @ts-ignore
      result[key] = dayjs(result[key]).tz('Europe/Berlin').format();
    } else if (result[key] && typeof result[key] === 'object') {
      result[key] = convertTz(result[key], timezone);
    }
  }

  return result;
}
