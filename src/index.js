import "dotenv/config";
import prompt from "prompt";
import schema from "./schema.js";
import execution from "./execution.js";
import { readFiles } from './data.js';

async function initialize() {
	var formDataFiles = await readFiles();

	if (!formDataFiles.length) {
		return console.log("\nnão foram encontrados arquivos em form-data");
	}

	var schemaList = schema(formDataFiles);

	prompt.start();
	prompt.get(schemaList[0], function (err, r) {
		if (err) {
			return console.log("\noperação cancelada");
		}

		console.log("\nos lançamentos seguirão a configuração a seguir");

		for (var x in r) console.log(` ${x} : `, JSON.stringify(r[x]));

		prompt.get(schemaList[1], function (err2, r2) {
			if (err2 || r2.check !== "S") {
				return console.log("\noperação cancelada");
			}

			r.cookie = process.env.COOKIE;
			// console.log(r.cookie, "ENV");
			if (!r.cookie) {
				return console.error("\nCOOKIE inválido");
			}

			console.log("\noperação iniciada");
			execution(r);
		});
	});
}

initialize();