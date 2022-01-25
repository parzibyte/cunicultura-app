import Vue from 'vue'
import Router from 'vue-router'
import Tabs from '@/components/Tabs'
import Apareamientos from '@/components/Conejos/Apareamiento/Apareamientos'
import AgregarApareamiento from '@/components/Conejos/Apareamiento/AgregarApareamiento'
import EditarConejo from '@/components/Conejos/EditarConejo'
import Login from '@/components/Usuarios/Login'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./services/BaseDeDatosService";
import BaseDeDatosService from './services/BaseDeDatosService'

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Tabs',
            component: Tabs
        },
        {
            path: '/apareamientos/:id',
            name: 'Apareamientos',
            component: Apareamientos
        },
        {
            path: '/agregar-apareamiento/:id',
            name: 'AgregarApareamiento',
            component: AgregarApareamiento
        },
        {
            path: '/editar-conejo/:id',
            name: 'EditarConejo',
            component: EditarConejo,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        }

    ]
});

BaseDeDatosService.obtener(); // No queremos la base de datos, solo queremos inicializar la app
onAuthStateChanged(getAuth(), (user) => {
    if (!user) {
        if (router.currentRoute.name !== "Login") {
            router.push({ name: "Login" });
        }
    } else {

        router.push({ name: "Tabs" });
    }
});
router.beforeEach((haciaDonde, desdeDonde, siguiente) => {
    const usuario = getAuth().currentUser;
    if (!usuario && haciaDonde.name !== "Login") {
        siguiente({ name: "Login" });
    } else {
        siguiente();
    }

});
export default router;