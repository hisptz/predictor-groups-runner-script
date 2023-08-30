import { Command } from "commander";
import appDetails from "../../package.json";
import logger from "../logging";
import { printDHIS2Info } from "../clients/sysInfo";
import {
  getDateIntervalsForPredictorEvaluation,
  getDefaultLastDateForPredictorEvaluation,
  getDefaultStartDateForPredictorEvaluation,
} from "../utils/date";
import { DateIntervals } from "../types";
import { initiatePredictorEvaluationProcess } from "../services";

const program = new Command();

program
  .command("generate")
  .description(
    "Generate predictor data for all predictor groups monthly in the specified period range, or for the current month if no period range is specified."
  )
  .option("-s --startDate <startDate>", "Start date for script coverage")
  .option("-e --endDate <endDate>", "End date for script coverage")
  .action(async (args) => {
    let { startDate, endDate } = args ?? {};
    let dateIntervals: DateIntervals[] = [];
    if (!startDate && !endDate) {
      startDate = getDefaultStartDateForPredictorEvaluation();
      endDate = getDefaultLastDateForPredictorEvaluation();
      dateIntervals.push({
        startDate,
        endDate,
      });
    } else {
      dateIntervals = getDateIntervalsForPredictorEvaluation(
        startDate,
        endDate
      );
    }
    for (const { startDate, endDate } of dateIntervals) {
      await initiatePredictorEvaluationProcess(startDate, endDate);
    }
  });

program
  .command(`dhis2-info`)
  .description("Print out connected DHIS2 instance information")
  .action(async () => {
    await printDHIS2Info();
  });
export default program;
