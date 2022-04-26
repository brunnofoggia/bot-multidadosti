import "dotenv/config";
import prompt from "./prompt.js";
import schema from "./schema.js";
import { readFiles } from './data.js';
import { check } from "./execution.js";

async function initialize() {
	var formDataFiles = await readFiles();

	if (!(await check(process.env.COOKIE, formDataFiles))) return;

	var schemaList = schema(formDataFiles);
	prompt(schemaList);
}

initialize();