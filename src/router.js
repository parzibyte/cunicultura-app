import Vue from 'vue'
import Router from 'vue-router'
import Tabs from '@/components/Tabs'
import Apareamientos from '@/components/Conejos/Apareamiento/Apareamientos'
import AgregarApareamiento from '@/components/Conejos/Apareamiento/AgregarApareamiento'
import EditarConejo from '@/components/Conejos/EditarConejo'

Vue.use(Router);

export default new Router({
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

    ]
});