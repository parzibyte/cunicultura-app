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
                resolve(instantaneaDocumento.data());
            } else {
                reject("No existe conejo con ese ID");
            }
        });
    },
    async obtenerConejosConGenero(genero) {
        return ConejosService.obtenerConejosUsandoConsultas(
            [where("genero", "==", genero),
            where("fechaFallecimiento", "==", null),
            where("vendido", "==", false)]
        );
    },
    async obtenerConejosUsandoConsultas(consultas) {
        const coleccion = await BaseDeDatosService.obtenerColeccionConejos();
        return new Promise((resolve) => {
            const consulta = query(
                coleccion,
                ...consultas
            );
            onSnapshot(consulta, (instantanea) => {
                resolve(instantanea);
            });
        });
    },
};
export default ConejosService;