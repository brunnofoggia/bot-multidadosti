import fs from "fs";
import glob from 'glob';
import _ from "lodash";

const DIR = 'form-data';

var readFiles = function () {
    return new Promise((resolve, reject) => {
        var fileList = [];

        glob("./" + DIR + "/*", {}, function (err, files) {
            try {
                files.map(file => {
                    var fileName = file.split('/')[2];
                    fileList.push(fileName);
                });
            } catch (e) {
                reject(e);
            }
            resolve(fileList);
        });
    });
};

var fileContent = {};

var readFile = function (file) {
    if (!fileContent[file]) {
        fileContent[file] = fs.readFileSync(DIR + "/" + file, "utf8");
    }

    var data = '' + fileContent[file], data0, data1;

    data0 = data
        .replace(/\(vazio\)\n/g, "")
        .replace(/\r/g, '')
        .split("\n")
        .join("\", \n");

    data1 = data0
        .replace(/^(.)/, "\n$1")
        .replace(/\n(.+)\:\s{1}/g, '\n"$1":"')
        .replace(/(.)$/, '$1"\n}')
        .replace(/^\n/, "{\n");
    try {
        var json = JSON.parse(data1);
        return json;
    } catch (e) {
        console.log(data0);
        console.log('erro json parse');
    }
};

var set = function ({
    formDataFile,
    descricao,
    hrInicio,
    hrFim,
    hrIntervaloInicio,
    hrIntervaloFim,
}) {
    var hrTempo = hrFim - hrInicio;
    var hrIntervaloTempo = hrIntervaloFim - hrIntervaloInicio;

    const HORA_INICIAL = (hrInicio + "").padStart(2, "0") + ":00";
    const HORA_FINAL = (hrFim + "").padStart(2, "0") + ":00";
    const HORA_INTERVALO_INICIAL =
        (hrIntervaloInicio + "").padStart(2, "0") + ":00";
    const HORA_INTERVALO_FINAL = (hrIntervaloFim + "").padStart(2, "0") + ":00";

    const TEMPO_DIGITADO = (hrTempo + "").padStart(2, "0") + ":00";
    const TEMPO_INTERVALO_DIGITADO =
        (hrIntervaloTempo + "").padStart(2, "0") + ":00";

    let fileData = readFile(formDataFile);
    if (!fileData) return;

    var json = _.omit(
        _.defaults(
            {
                // nao alterar nada abaixo
                // descricao do card
                narrativa_principal: descricao,
                "timecard[narrativa_principal]": descricao,
                // horarios
                intervalor_total: TEMPO_INTERVALO_DIGITADO,
                hora: HORA_INICIAL,
                intervalo_hr_inicial: HORA_INTERVALO_INICIAL,
                intervalo_hr_final: HORA_INTERVALO_FINAL,
                hora_fim: HORA_FINAL,
                tempo_digitado: TEMPO_DIGITADO,
                "timecard[intervalor_total]": TEMPO_INTERVALO_DIGITADO,
                "timecard[hora]": HORA_INICIAL,
                "timecard[intervalo_hr_inicial]": HORA_INTERVALO_INICIAL,
                "timecard[intervalo_hr_final]": HORA_INTERVALO_FINAL,
                "timecard[hora_fim]": HORA_FINAL,
                "timecard[tempo_digitado]": TEMPO_DIGITADO,
            },
            fileData
        ),
        "data",
        "timecard[data]",
        "idtimecard",
        "timecard[idtimecard]"
    );

    return json;
}

var generate = function (options) {
    var formData = new URLSearchParams();
    var params = set(options);
    if (!params) return;

    var date = Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(options.data);

    Object.entries(params).forEach((param) => {
        formData.append(param[0], param[1]);
    });
    formData.append("data", date);
    formData.append("timecard[data]", date);

    return formData;
};

export { readFiles, generate };
export default { readFiles, generate };
