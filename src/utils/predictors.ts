import { config } from "dotenv";

import { dhis2Client } from "../clients";
import logger from "../logging";
import { Predictor, PredictorGroup } from "../types";
import { filter, isEmpty, map, flattenDeep } from "lodash";
import { asyncify, mapLimit } from "async";

config();

export async function getPredictorGroups(): Promise<PredictorGroup[]> {
  logger.info(`Fetching Predictors groups`);
  const url = "predictorGroups?paging=false&fields=id,name,predictors[id,name]";
  try {
    const response = await dhis2Client.get(url);

    if (response.status !== 200) {
      logger.error(
        `Failed to fetch predictor groups! ${response?.data?.message ?? ""}`,
      );
      return [];
    }
    const predictorGroups = (response?.data?.predictorGroups ??
      []) as PredictorGroup[];
    logger.info(
      `Successfully fetched ${predictorGroups.length} predictor groups`,
    );

    const groups = (process.env.PREDICTOR_GROUPS ?? "").split(",");

    if (!isEmpty(groups)) {
      logger.info(
        `Filtering predictor groups based on the provided groups: ${groups}`,
      );
    }

    return flattenDeep(
      isEmpty(groups)
        ? predictorGroups
        : map(groups, (group) => {
            return filter(predictorGroups, (predictorGroup) =>
              predictorGroup.id.includes(group),
            );
          }),
    );
  } catch (error) {
    logger.error(`Failed to fetch predictor groups! See the error bellow.`);
    logger.error(`${JSON.stringify(error)}`);
    return [];
  }
}

export async function runPredictorsFromPredictorGroups(
  predictorGroup: PredictorGroup,
  startDate: string,
  endDate: string,
): Promise<string> {
  const processBuffer = 10;
  const results: string[] = [];

  await mapLimit(
    predictorGroup.predictors,
    processBuffer,
    asyncify(async (predictor: Predictor) => {
      try {
        const result = await runPredictor(predictor, startDate, endDate);
        results.push(result);
      } catch (error) {
        logger.error(
          `Failed to run predictor ${predictor.name} from group ${predictorGroup.name}! See the error below.`,
        );
        logger.error(`${JSON.stringify(error)}`);
        results.push(`Failed to run predictor ${predictor.name}`);
      }
    }),
  );

  const combinedResults = combinePredictorResults(results);

  logger.info(
    `Successfully ran ${results.length} predictors from group ${predictorGroup.name}: ${combinedResults}`,
  );

  return combinedResults;
}

function combinePredictorResults(results: string[]): string {
  let generatedPredictions = 0;
  let hasGeneratedPredictions = false;
  const otherResults = results.filter((result) => {
    const match = result.match(/^Generated (\d+) predictions$/);
    if (!match) {
      return true;
    }

    hasGeneratedPredictions = true;
    generatedPredictions += Number(match[1]);
    return false;
  });

  if (hasGeneratedPredictions) {
    otherResults.push(`Generated ${generatedPredictions} predictions`);
  }

  return otherResults.join("\n");
}

export async function runPredictor(
  predictor: Predictor,
  startDate: string,
  endDate: string,
) {
  logger.info(
    `Generating predictions for ${predictor.name} from ${startDate} to ${endDate}`,
  );
  try {
    const url = `predictors/${predictor.id}/run?startDate=${startDate}&endDate=${endDate}`;
    const response = await dhis2Client.post(url);

    if (response.status !== 200) {
      logger.error(
        `Failed to generate the predictions! ${response?.data?.message ?? ""}`,
      );
      return "Failed to generate predictions";
    }
    const message =
      response?.data?.message ?? "Successfully generated the predictions";
    return message;
  } catch (error) {
    logger.error(`Failed to run ${predictor.name}! See the error below.`);
    logger.error(`${JSON.stringify(error)}`);
    return "Failed to generate predictions";
  }
}

export async function runPredictorGroup(
  predictorGroup: PredictorGroup,
  startDate: string,
  endDate: string,
): Promise<string> {
  logger.info(
    `Generating predictions for ${predictorGroup.name} Group from ${startDate} to ${endDate}`,
  );
  try {
    const url = `predictorGroups/${predictorGroup.id}/run?startDate=${startDate}&endDate=${endDate}`;
    const response = await dhis2Client.post(url);

    if (response.status !== 200) {
      logger.error(
        `Failed to generate the predictions! ${response?.data?.message ?? ""}`,
      );
      return "Failed to generate predictions";
    }
    const message =
      response?.data?.message ?? "Successfully generated the predictions";
    logger.info(message);
    return message;
  } catch (error) {
    logger.error(
      `Failed to run ${predictorGroup.name} group! See the error below.`,
    );
    logger.error(`${JSON.stringify(error)}`);
    return "Failed to generate predictions";
  }
}
