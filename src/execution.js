import { checkCookie, insertData } from "./provider.js";
import { generate } from "./data.js";

var check = async function (cookie, formDataFiles) {
	var result = true;

	if (!formDataFiles.length) {
		console.log("\nnão foram encontrados arquivos em form-data");
		result = false;
	}

	if (!(await checkCookie(cookie))) result = false;
	return result;
};

var exec = async function ({
	formDataFile,
	descricao = "Atividade",
	feriados = [],
	hrInicio = 9,
	hrFim = 18,
	hrIntervaloInicio = 12,
	hrIntervaloFim = 13,
	mes = null,
	ano = null,
	dia = 1,
	diaFim = 0,
	cookie = null,
}) {
	var c = 0,
		dias = [],
		dataHoje = new Date(),
		data;

	!ano && (ano = dataHoje.getFullYear());
	mes = mes ? mes - 1 : dataHoje.getMonth();
	data = new Date(ano, mes, dia, 12);

	do {
		let formData =
			generate({
				formDataFile,
				descricao,
				hrInicio,
				hrFim,
				hrIntervaloInicio,
				hrIntervaloFim,
				data,
			});

		if (
			![6, 0].includes(data.getDay()) &&
			!feriados.includes(data.getDate())
		) {
			// console.log(data.toDateString());

			console.log(formData.get('data'), 'adicionada a fila');
			insertData(formData, { cookie, timeout: (30000 * (c < 8 ? 0 : c < 16 ? 1 : c < 24 ? 2 : 3) + dia) + 100, });
			// console.log(formData);
			// break;
		} else {
			console.log(formData.get('data'), 'é FDS ou feriado');
		}
		data.setDate(++dia);
		c++;
	} while (data.getMonth() === mes && (!diaFim || data.getDate() <= diaFim));
};

export { check, exec };
