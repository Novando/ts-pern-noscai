export function normalizeIsoDate(input: string): string {
  return input.replace(
    /([+-])(\d{1,2})(?!:?\d{2})$/, // match "+2", "+02", "-5", "-05" at end
    (_, sign, hours) => {
      const padded = hours.padStart(2, "0"); // "2" -> "02"
      return `${sign}${padded}:00`;
    }
  );
}