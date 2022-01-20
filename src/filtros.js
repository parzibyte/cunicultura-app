import Vue from 'vue'
const formateadorFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', });
const DiaEnMilisegundos = 1000 * 60 * 60 * 24;
const AñoEnMilisegundos = DiaEnMilisegundos * 365;
const MesEnMilisegundos = AñoEnMilisegundos / 12;
Vue.filter("timestampAFecha", timestamp => {
    if (!timestamp) {
        return "";
    }
    return formateadorFecha.format(new Date(timestamp));
});

Vue.filter("diferenciaAEdad", milisegundosDiferencia => {
    if (!milisegundosDiferencia) {
        return "";
    }
    let resultado = "";
    const años = Math.floor(milisegundosDiferencia / AñoEnMilisegundos);
    milisegundosDiferencia -= años * AñoEnMilisegundos;
    const meses = Math.floor(milisegundosDiferencia / MesEnMilisegundos);
    milisegundosDiferencia -= meses * MesEnMilisegundos;
    const dias = Math.floor(milisegundosDiferencia / DiaEnMilisegundos);

    if (años > 0) {
        resultado += `${años} año${años > 1 ? 's' : ''} `;
    }
    if (meses > 0) {
        resultado += `${meses} mes${meses > 1 ? 'es' : ''} `;
    }
    if (dias > 0) {
        resultado += `${dias} día${dias > 1 ? 's' : ''}`;
    }
    return resultado;
});
Vue.filter("edad", timestamp => {
    if (!timestamp) {
        return "";
    }
    let resultado = "";
    const fecha = new Date(timestamp);
    const ahora = new Date();
    let milisegundosDiferencia = ahora - fecha;
    const años = Math.floor(milisegundosDiferencia / AñoEnMilisegundos);
    milisegundosDiferencia -= años * AñoEnMilisegundos;
    const meses = Math.floor(milisegundosDiferencia / MesEnMilisegundos);
    milisegundosDiferencia -= meses * MesEnMilisegundos;
    const dias = Math.floor(milisegundosDiferencia / DiaEnMilisegundos);

    if (años > 0) {
        resultado += `${años} año${años > 1 ? 's' : ''} `;
    }
    if (meses > 0) {
        resultado += `${meses} mes${meses > 1 ? 'es' : ''} `;
    }
    if (dias > 0) {
        resultado += `${dias} día${dias > 1 ? 's' : ''}`;
    }
    return resultado;
});
