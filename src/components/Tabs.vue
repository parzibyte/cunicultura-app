<template>
  <b-tabs type="is-boxed" position="is-centered" v-model="tabActiva">
    <b-tab-item icon="plus" label="">
      <agregar-conejo />
    </b-tab-item>
    <b-tab-item icon="rabbit" label="">
      <conejos />
    </b-tab-item>
    <b-tab-item icon="cash" label="">
      <ventas />
    </b-tab-item>
    <b-tab-item icon="information">
      <acerca-de />
    </b-tab-item>
  </b-tabs>
</template>
<script>
import AgregarConejo from "./Conejos/AgregarConejo.vue";
import Conejos from "./Conejos/Conejos.vue";
import AcercaDe from "./AcercaDe.vue";
import Ventas from "./Ventas/Ventas.vue";
export default {
  components: { AgregarConejo, Conejos, AcercaDe, Ventas },
  data: () => ({
    tabActiva: 1,
  }),
};
</script>