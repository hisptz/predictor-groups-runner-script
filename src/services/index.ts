import logger from "../logging";
import {
  getDefaultLastDateForPredictorEvaluation,
  getDefaultStartDateForPredictorEvaluation,
} from "../utils/date";
import { getPredictorGroups, runPredictorGroup } from "../utils/predictors";

export async function initiatePredictorEvaluationProcess(
  startDate?: string,
  endDate?: string
): Promise<string | undefined> {
  const results: any[] = [];
  startDate = startDate ?? getDefaultStartDateForPredictorEvaluation();
  endDate = endDate ?? getDefaultLastDateForPredictorEvaluation();
  logger.info(`Started running the predictors from ${startDate} to ${endDate}`);

  try {
    const predictorGroups = await getPredictorGroups();
    for (let predictorGroup of predictorGroups) {
      const result = await runPredictorGroup(
        predictorGroup,
        startDate,
        endDate
      );
      results.push({
        ...predictorGroup,
        result,
      });
    }
    let htmlTable = `<h3>Predictions Results from ${startDate} to ${endDate}</h3><table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Result</th>
      </tr>`;
    results.forEach((res) => {
      htmlTable += `<tr>
        <td>${res.id}</td>
        <td>${res.name}</td>
        <td>${res.result}</td>
      </tr>`;
    });

    htmlTable += `</table>`;

    return htmlTable;
  } catch (error) {
    logger.error(`Failed to evaluate Predictors! check the error below.`);
    logger.error(`${JSON.stringify(error)}`);
    throw error;
  }
}
