import { config } from "dotenv";
import program from "./commands";
import { initiatePredictorEvaluationProcess } from "./services";

config();
program.parse(process.argv);

initiatePredictorEvaluationProcess();
