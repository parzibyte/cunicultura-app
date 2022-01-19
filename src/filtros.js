import Vue from 'vue'
const formateadorFecha = new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium',  });
Vue.filter("timestampAFecha", timestamp => {
    if (!timestamp) {
        return "";
    }
    return formateadorFecha.format(new Date(timestamp));
});