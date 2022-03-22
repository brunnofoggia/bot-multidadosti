import _ from "lodash";

var schema = function (formDataFiles) {
	var schemas = [];
	schemas.push({
		properties: {
			formDataFile: {
				description: "Qual projeto deseja lançar? (disponíveis: " + formDataFiles.join(', ') + ')',
				type: "string",
				required: true,
				conform: (v) => _.indexOf(formDataFiles, v) !== -1,
				default: formDataFiles[0],
				message: "Informe um projeto dentre os disponíveis",
			},
			descricao: {
				description: "Qual a descrição para as atividades?",
				type: "string",
				default: "Atividade",
				required: true,
				message: "Informe um descritivo",
			},
			ano: {
				description: "Qual ano deseja lançar (2021-202X)",
				type: "integer",
				default: new Date().getFullYear(),
				conform: (v) => /^((202[1-9]))$/.test(v),
				message: "Informe o ano a partir de 2021",
			},
			mes: {
				description: "Qual mês deseja lançar (1-12)",
				type: "integer",
				default: new Date().getMonth() + 1,
				conform: (v) => /^(([1-9])|(1[0-2]))$/.test(v),
				message: "Informe o mês entre 1 e 12",
			},
			dia: {
				description: "Em qual dia deseja iniciar os lançamentos (1-31)",
				type: "integer",
				default: 1,
				conform: (v) => /^(([0-9])|([1-2][0-9])|(3[0-1]))$/.test(v),
				message: "Informe um dia entre 1 e 31",
			},
			diaFim: {
				description: "Em qual dia deseja concluir os lançamentos (1-31)",
				type: "integer",
				default: 0,
				conform: (v) => /^(([0-9])|([1-2][0-9])|(3[0-1]))$/.test(v),
				message: "Informe um dia entre 1 e 31",
			},
			hrInicio: {
				description: "Qual o horário de início das suas atividades (0-23)",
				type: "integer",
				default: 9,
				conform: (v) => /^(([0-9])|(1[0-9])|(2[0-3]))$/.test(v),
				message: "Informe um horario entre 0 e 23",
			},
			hrFim: {
				description: "Qual o horário de término das suas atividades (0-23)",
				type: "integer",
				default: 18,
				conform: (v) => /^(([0-9])|(1[0-9])|(2[0-3]))$/.test(v),
				message: "Informe um horario entre 0 e 23",
			},
			hrIntervaloInicio: {
				description: "Qual o horário de início do seu almoço (0-23)",
				type: "integer",
				default: 12,
				conform: (v) => /^(([0-9])|(1[0-9])|(2[0-3]))$/.test(v),
				message: "Informe um horario entre 0 e 23",
			},
			hrIntervaloFim: {
				description: "Qual o horário de término do seu almoço (0-23)",
				type: "integer",
				default: 13,
				conform: (v) => /^(([0-9])|(1[0-9])|(2[0-3]))$/.test(v),
				message: "Informe um horario entre 0 e 23",
			},
			feriados: {
				description:
					"Quais dias deseja ignorar (feriados) (dias separados por virgula)",
				type: "string",
				default: "",
				before: (v) =>
					v
						.replace(/[^0-9,]/g, "")
						.split(",")
						.map((d) => parseInt(d, 10))
						.filter((d) => !!d && d > 0 && d <= 31),
			},
		},
	});

	schemas.push({
		properties: {
			check: {
				description: "Você confirma? (S/N)",
				type: "string",
				conform: (v) => /^[sSnN]$/.test(v),
				message: "(S)im ou (N)ão",
				default: "N",
				required: true,
				before: (v) => v.toUpperCase(),
			},
		},
	});

	return schemas;
};

export default schema;