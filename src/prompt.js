import prompt from "prompt";
import { exec } from "./execution.js";

export default function (schemaList) {
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

			console.log("\noperação iniciada");
			exec(r);
		});
	});
}