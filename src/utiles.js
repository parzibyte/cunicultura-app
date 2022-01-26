const DiaEnMilisegundos = 1000 * 60 * 60 * 24;
const AñoEnMilisegundos = DiaEnMilisegundos * 365;
const MesEnMilisegundos = AñoEnMilisegundos / 12;
const diferenciaEnMilisegundosATiempoTranscurridoLegible = (diferenciaEnMilisegundos) => {
    if (!diferenciaEnMilisegundos) {
        return "";
    }
    const años = Math.floor(diferenciaEnMilisegundos / AñoEnMilisegundos);
    diferenciaEnMilisegundos -= años * AñoEnMilisegundos;
    const meses = Math.floor(diferenciaEnMilisegundos / MesEnMilisegundos);
    diferenciaEnMilisegundos -= meses * MesEnMilisegundos;
    const dias = Math.floor(diferenciaEnMilisegundos / DiaEnMilisegundos);
    return formatearAñosMesesYDias(años, meses, dias);
};

const tiempoTranscurridoHastaHoy = (timestamp) => {
    return diferenciaEnMilisegundosATiempoTranscurridoLegible(new Date().getTime() - new Date(timestamp));
};
const informacionDeConejoSegunNacimiento = (conejo) => {
    if (!conejo.fechaNacimiento) {
        return [];
    }
    const diferencia = new Date().getTime() - conejo.fechaNacimiento;
    const edadEnDias = diferencia / DiaEnMilisegundos;
    const edadEnMeses = edadEnDias / 30;
    const informacion = [];
    if (edadEnDias >= 35 && edadEnDias <= 40) {
        informacion.push("Separar de la madre (debe ser a los 35 días de nacido)");
    }
    if (edadEnDias >= 70) {
        informacion.push("Listo para sacrificio (debe pesar entre 2 y 2.2 Kg)");
    }
    if (conejo.genero === "H") {
        if (edadEnMeses > 4.5) {
            informacion.push("Lista para reproducción (debe pesar entre 3.5 y 3.8 Kg)");
        }
    } else {
        if (edadEnMeses > 5) {
            informacion.push("Listo para reproducción (debe pesar entre 3.8 y 4.2 Kg)");
        }
    }
    return informacion;
};
const informacionDeGestacion = (apareamiento) => {
    if (!apareamiento.fechaInicio) {
        return "";
    }
    const diferencia = new Date().getTime() - apareamiento.fechaInicio;
    const transcurridoEnDias = diferencia / DiaEnMilisegundos;
    if (transcurridoEnDias >= 14 && transcurridoEnDias <= 16) {
        return "Palpación";
    } else if (transcurridoEnDias >= 25 && transcurridoEnDias <= 27) {
        return "Nido para el parto";
    } else if (transcurridoEnDias >= 29) {
        return "Parto (entre 29 y 30 días después del apareamiento)";
    }
};

const formatearAñosMesesYDias = (años, meses, dias) => {
    let resultado = "";
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
};
const Utiles = {
    diferenciaEnMilisegundosATiempoTranscurridoLegible, tiempoTranscurridoHastaHoy, formatearAñosMesesYDias, informacionDeConejoSegunNacimiento, informacionDeGestacion
};
export default Utiles;