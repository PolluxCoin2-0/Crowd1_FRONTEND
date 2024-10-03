export function shortenString(str, value) {
    if (str.length <= 8) {
      return str; // If the string is 8 characters or less, return it as is
    }
    const start = str.substring(0, value); // First value characters
    const end = str.substring(str.length - value); // Last value characters
    return `${start}...${end}`;
  }
  