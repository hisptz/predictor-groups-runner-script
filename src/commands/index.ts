import { Command } from "commander";
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

    const evaluationResults: string[] = [];

    for (const { startDate, endDate } of dateIntervals) {
      try {
        const result = await initiatePredictorEvaluationProcess(
          startDate,
          endDate
        );
        result && evaluationResults.push(result);
      } catch (error) {
        logger.error(
          `Failed to run predictor evaluation for period ${startDate} to ${endDate}`
        );
        logger.error(error);
      }
    }

    logger.info("Predictor data generation process completed.");

    // send notification emails
    await import("../utils/predictor-notifications").then(
      async ({ sendNotifications }) => {
        await sendNotifications(evaluationResults);
      }
    );
  });

program
  .command(`dhis2-info`)
  .description("Print out connected DHIS2 instance information")
  .action(async () => {
    await printDHIS2Info();
  });
export default program;
