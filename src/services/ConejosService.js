import { onSnapshot, query, where } from "firebase/firestore";
import BaseDeDatosService from "./BaseDeDatosService";

const ConejosService = {
    async obtenerConejosConGenero(genero) {
        const coleccion = await BaseDeDatosService.obtenerColeccionConejos();
        return new Promise((resolve) => {
            const consulta = query(
                coleccion,
                where("genero", "==", genero),
                where("fechaFallecimiento", "==", null),
                where("vendido", "==", false)
            );
            onSnapshot(consulta, (instantanea) => {
                resolve(instantanea);
            });
        });
    },
};
export default ConejosService;