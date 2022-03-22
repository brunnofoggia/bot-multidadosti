import axios from "axios";

async function insertData(formData, options) {
	try {
		const url =
			"https://seastorm.multidadosti.com.br/includes/ajax_calls/saveLanctos.ajax.php";

		const config = {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				cookie: options.cookie,
				authority: "seastorm.multidadosti.com.br",
				scheme: "https",
			},
		};

		console.info(`Date ${formData.get('data')} is going to be saved`);
		// console.info(JSON.stringify(config.headers.cookie), `cookie`);

		setTimeout(async () => {
			const { data } = await axios.post(url, formData, config);
			if (data.sucesso === "T" && data.id_lancto_atividade != "") {
				console.info(
					`Date ${formData.get('data')} was saved`
				);
			} else {
				console.error(`Error with date ${formData.get('data')}: ${data.msg}`);
			}
		}, options.timeout);
		// console.info(JSON.stringify(data), `retorno`);
	} catch (error) {
		console.error(`Error while trying to insert date ${formData.get('data')}. Error:`);
		console.error(error);
	}
}

export { insertData };
