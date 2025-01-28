export function getOrdinalSuffix(input) {
  const number = Number(input);
  if (isNaN(number) || !Number.isInteger(number)) {
    // throw new Error('Input must be an integer.');
    return input
  }

  const suffixes = ["th", "st", "nd", "rd"];
  const value = number % 100;

  // Check for "teen" exceptions
  if (value >= 11 && value <= 13) {
    return input + "th";
  }

  // Use the last digit to determine the suffix
  return input + (suffixes[number % 10] || "th");
}
