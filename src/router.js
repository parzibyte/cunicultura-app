import Vue from 'vue'
import Router from 'vue-router'
import Tabs from '@/components/Tabs'
import Apareamientos from '@/components/Conejos/Apareamiento/Apareamientos'

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
        }
    ]
});