import axios from "axios";

const HOST = 'https://seastorm.multidadosti.com.br';

function getConfig(options) {
	return {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			cookie: options.cookie,
			authority: "seastorm.multidadosti.com.br",
			scheme: "https",
		},
	};
}

async function checkCookie(cookie) {
	if (!cookie) {
		console.error("\nInforme o cookie no .env");
		return false;
	}

	try {
		console.log('Checando cookie');
		const url = HOST + "/timesheet/multidados/module/calendario/index.php";
		const config = getConfig({ cookie });

		const { data, status } = await axios.post(url, null, config);
		// console.log('check cookie response - ', data, data.length, status);
		if (!/login/.test(data)) {
			console.log('Cookie válido');
			return true;
		}
	} catch (err) {
		// console.log('check cookie error - ', err);
	}
	console.log('Cookie inválido');
	return false;
}

async function insertData(formData, options) {
	try {
		const url = HOST + "/includes/ajax_calls/saveLanctos.ajax.php";
		const config = getConfig(options);

		setTimeout(async () => {
			console.log(formData.get('data'), 'enviando dados');
			const { data } = await axios.post(url, formData, config);
			if (data.sucesso === "T" && data.id_lancto_atividade != "") {
				console.log(formData.get('data'), 'tarefa salva');
			} else {
				console.log(formData.get('data'), 'problema encontrado', data.msg);
			}
		}, options.timeout);
		// console.info(JSON.stringify(data), `retorno`);
	} catch (error) {
		console.log(formData.get('data'), 'falha ao processar', error);
	}
}

export { checkCookie, insertData };
