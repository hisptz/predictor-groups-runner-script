import { config } from "dotenv";

import { dhis2Client } from "../clients";
import logger from "../logging";
import { PredictorGroup } from "../types";
import { filter, isEmpty, map, flattenDeep } from "lodash";

config();

export async function getPredictorGroups(): Promise<PredictorGroup[]> {
  logger.info(`Fetching Predictors groups`);
  const url = "predictorGroups?paging=false&fields=id,name";
  try {
    const response = await dhis2Client.get(url);

    if (response.status !== 200) {
      logger.error(
        `Failed to fetch predictor groups! ${response?.data?.message ?? ""}`
      );
      return [];
    }
    const predictorGroups = (response?.data?.predictorGroups ??
      []) as PredictorGroup[];
    logger.info(
      `Successfully fetched ${predictorGroups.length} predictor groups`
    );

    const groups = (process.env.PREDICTOR_GROUPS ?? "").split(",");

    if (!isEmpty(groups)) {
      logger.info(
        `Filtering predictor groups based on the provided groups: ${groups}`
      );
    }

    return flattenDeep(
      isEmpty(groups)
        ? predictorGroups
        : map(groups, (group) => {
            return filter(predictorGroups, (predictorGroup) =>
              predictorGroup.id.includes(group)
            );
          })
    );
  } catch (error) {
    logger.error(`Failed to fetch predictor groups! See the error bellow.`);
    logger.error(`${JSON.stringify(error)}`);
    return [];
  }
}

export async function runPredictorGroup(
  predictorGroup: PredictorGroup,
  startDate: string,
  endDate: string
): Promise<void> {
  logger.info(
    `Generating predictions for ${predictorGroup.name} Group from ${startDate} to ${endDate}`
  );
  try {
    const url = `predictorGroups/${predictorGroup.id}/run?startDate=${startDate}&endDate=${endDate}`;
    const response = await dhis2Client.post(url);

    if (response.status !== 200) {
      logger.error(
        `Failed to generate the predictions! ${response?.data?.message ?? ""}`
      );
      return;
    }

    const message =
      response?.data?.message ?? "Successfully generated the predictions";
    logger.info(message);
  } catch (error) {
    logger.error(
      `Failed to run ${predictorGroup.name} group! See the error below.`
    );
    logger.error(`${JSON.stringify(error)}`);
  }
}
