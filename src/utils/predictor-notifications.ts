import { config } from "dotenv";
import logger from "../logging";

config();

export async function sendNotifications(
  evaluationResults: string[]
): Promise<void> {
  const contextPath = process.env.INSTANCE_NAME ?? "DHIS2";

  const emailRecipients = process.env.EMAIL_RECIPIENTS;
  try {
    if (evaluationResults.length) {
      const finalHtml =
        "<p>The predictor evaluation results on " +
        contextPath +
        " are as follows:</p>" +
        evaluationResults.join("<br/>");
      if (emailRecipients) {
        await import("../utils/email-notifications").then(
          async ({ sendEmailNotification }) => {
            await sendEmailNotification({
              to: emailRecipients,
              subject: `Predictor Evaluation Results`,
              htmlContent: finalHtml,
            });
          }
        );
        logger.info(`Prediction results email sent to: ${emailRecipients}`);
      }
    } else {
      logger.info("No predictor evaluation results to display.");
      if (emailRecipients) {
        await import("../utils/email-notifications").then(
          async ({ sendEmailNotification }) => {
            await sendEmailNotification({
              to: emailRecipients,
              subject: `ERROR: Predictor Evaluation Results`,
              textContent:
                "There were no predictor evaluation results. To see more details, please check the server logs.",
            });
          }
        );
        logger.info(`Notification email sent to: ${emailRecipients}`);
      }
    }
  } catch (error) {
    logger.error(`Failed to send notification emails! check the error below.`);
    logger.error(error);
  }
}
