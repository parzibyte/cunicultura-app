import Vue from 'vue'
import utiles from "./utiles"
const formateadorFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', });
const formateadorDinero = new Intl.NumberFormat("en", { style: "currency", "currency": "MXN" });
Vue.filter("dinero", cantidad => formateadorDinero.format(cantidad));
Vue.filter("timestampAFecha", timestamp => {
    if (!timestamp) {
        return "";
    }
    return formateadorFecha.format(new Date(timestamp));
});

Vue.filter("diferenciaAEdad", utiles.diferenciaEnMilisegundosATiempoTranscurridoLegible);
Vue.filter("edad", utiles.tiempoTranscurridoHastaHoy);