export function calculateDaysBetweenDates(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Convert the date strings to Date objects
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Calculate the number of days by dividing the difference by the number of milliseconds in a day
  const days = Math.round(differenceMs / oneDay);

  return days;
}

export function formatDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [year, month, day] = dateString.split("-");
  const formattedDay = getFormattedDay(parseInt(day));
  const monthName = months[parseInt(month) - 1];

  return `${formattedDay} ${monthName} ${year}`;
}

export function formatDateWithTime(dateString) {
  const date = new Date(dateString);

  // Get day with ordinal suffix
  const day = date.getDate();
  const dayWithSuffix = getFormattedDay(day);

  // Get month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  // Get hours and minutes
  let hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);

  // Convert hours to 12-hour format and determine am/pm
  const amOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  // Format the date
  const formattedDate = `${dayWithSuffix} ${month} ${date.getFullYear()} at ${hours}:${minutes} ${amOrPm}`;
  return formattedDate;
}

export function getFormattedDay(day) {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  } else {
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }
}

export function convertToIST(currentDate) {
  // Get the current timezone offset in minutes
  const currentOffset = currentDate.getTimezoneOffset();

  // IST timezone offset (India is UTC+5:30)
  const ISTOffset = 330; // Offset in minutes

  // Calculate the milliseconds difference between the current timezone and IST
  const ISTTimeDifference = (ISTOffset + currentOffset) * 60 * 1000;

  // Convert the date to IST
  const istDate = new Date(currentDate.getTime() + ISTTimeDifference);

  return istDate;
}
