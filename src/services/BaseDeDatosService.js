import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, collection } from "firebase/firestore";
import { getStorage,} from "firebase/storage";
import { ToastProgrammatic as Toast } from 'buefy'
let modoSinConexionActivado = true; // Deshabilitado porque marca muchos errores al inicio
const BaseDeDatosService = {
    obtener: async () => {
        const firebaseConfig = {
            apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
            authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
            projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
            storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.VUE_APP_FIREBASE_APP_ID,
        };
        const app = initializeApp(firebaseConfig);
        const bd = getFirestore(app);
        if (process.env.NODE_ENV !== "production") {
            return bd;
        }
        if (modoSinConexionActivado) {
            return bd;
        }
        try {
            await enableIndexedDbPersistence(bd);
            Toast.open({
                message: "Modo fuera de línea habilitado correctamente",
                type: "is-success",
            });
            modoSinConexionActivado = true;
        } catch (err) {
            console.log({ err });
            let mensaje = "";
            if (err.code == "failed-precondition") {
                mensaje =
                    "Error: recuerda no tener varias pestañas abiertas con la app";
            } else if (err.code == "unimplemented") {
                mensaje =
                    "Error: el navegador que usas no soporta el modo fuera de línea. Cambia de navegador";
            }
            mensaje += " " + err.toString();
            Toast.open({
                message: mensaje,
                type: "is-danger",
            });
        }
        return bd;
    },
    obtenerStorage() {
        return getStorage();
    },
    obtenerColeccionConejos: async () => {
        return collection(
            await BaseDeDatosService.obtener(),
            "conejos"
        );
    },
    obtenerColeccionVentas: async () => {
        return collection(
            await BaseDeDatosService.obtener(),
            "ventas"
        );
    },
    obtenerColeccionApareamientos: async () => {
        return collection(
            await BaseDeDatosService.obtener(),
            "apareamientos"
        );
    },
};
export default BaseDeDatosService;