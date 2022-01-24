import { doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import BaseDeDatosService from "./BaseDeDatosService";

const ConejosService = {
    async obtenerConejoPorId(id) {
        const instantaneaDocumento = await getDoc(
            doc(
                await BaseDeDatosService.obtener(),
                "conejos",
                id
            )
        );
        return new Promise((resolve, reject) => {
            if (instantaneaDocumento.exists()) {
                const conejo = instantaneaDocumento.data();
                conejo.id = instantaneaDocumento.id;
                resolve(conejo);
            } else {
                reject("No existe conejo con ese ID");
            }
        });
    },
    async obtenerConejosConGenero(genero, callback) {
        return ConejosService.obtenerConejosUsandoConsultas(
            [where("genero", "==", genero),
            where("fechaFallecimiento", "==", null),
            where("vendido", "==", false)], callback
        );
    },
    async obtenerConejosUsandoConsultas(consultas, callback) {
        const coleccion = await BaseDeDatosService.obtenerColeccionConejos();
        const consulta = query(
            coleccion,
            ...consultas
        );
        onSnapshot(consulta, callback);
    },
};
export default ConejosService;