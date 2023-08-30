import { DateTime } from "luxon";
import { DateIntervals } from "../types";

function getStartAndEndDates(inputDate: string): DateIntervals {
  const inputDateTime = DateTime.fromISO(inputDate);

  // Calculate the start date (first day of previous month)
  const startDateTime = inputDateTime.minus({ months: 1 }).startOf("month");

  // Calculate the end date (last day of input date's month)
  const endDateTime = inputDateTime.endOf("month");

  return {
    startDate: startDateTime.toISODate() ?? "",
    endDate: endDateTime.toISODate() ?? "",
  };
}

function formatDate(date: Date, format = "YYYY-MM-DD") {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return format
    .replace("YYYY", `${year}`)
    .replace("MM", month)
    .replace("DD", day);
}

export function getDefaultStartDateForPredictorEvaluation(): string {
  const today = new Date();
  return formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 1));
}

export function getDefaultLastDateForPredictorEvaluation(): string {
  const today = new Date();
  return formatDate(new Date(today.getFullYear(), today.getMonth(), 0));
}

export function getDateIntervalsForPredictorEvaluation(
  startDate?: string,
  endDate?: string
): Array<DateIntervals> {
  const defaultStartDate = "2000-01-01";

  let start = startDate
    ? DateTime.fromISO(startDate)
    : DateTime.fromISO(defaultStartDate);

  let end = endDate ? DateTime.fromISO(endDate) : DateTime.now();

  const dataIntervalsForEvaluation = [];
  let current = start.startOf("month");

  while (current <= end) {
    dataIntervalsForEvaluation.push(
      getStartAndEndDates(current.toISODate() ?? "")
    );
    current = current.plus({ months: 1 });
  }
  return dataIntervalsForEvaluation;
}
