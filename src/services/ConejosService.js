import { doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
import BaseDeDatosService from "./BaseDeDatosService";

const ConejosService = {
    async actualizarConejo(idConejo, conejo) {
        await updateDoc(doc(await BaseDeDatosService.obtener(), "conejos", idConejo), conejo);
    },
    async obtenerReferenciaParaFoto(identificadorConejo, nombreFoto) {
        return ref(getStorage(), "conejos/" + identificadorConejo + "/" + nombreFoto);
    },
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