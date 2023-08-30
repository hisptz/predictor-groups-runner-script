import logger from "../logging";
import {
  getDefaultLastDateForPredictorEvaluation,
  getDefaultStartDateForPredictorEvaluation,
} from "../utils/date";
import { getPredictorGroups, runPredictorGroup } from "../utils/predictors";

export async function initiatePredictorEvaluationProcess(
  startDate?: string,
  endDate?: string
) {
  startDate = startDate ?? getDefaultStartDateForPredictorEvaluation();
  endDate = endDate ?? getDefaultLastDateForPredictorEvaluation();
  logger.info(`Started running the predictors from ${startDate} to ${endDate}`);

  try {
    const predictorGroups = await getPredictorGroups();
    for (let predictorGroup of predictorGroups) {
      await runPredictorGroup(predictorGroup, startDate, endDate);
    }
  } catch (error) {
    logger.error(`Failed to evaluate Predictors! check the error below.`);
    logger.error(`${JSON.stringify(error)}`);
  }
}
