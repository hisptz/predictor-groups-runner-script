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
