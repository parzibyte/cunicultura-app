<template>
      <b-tabs type="is-boxed" position="is-centered" v-model="tabActiva">
        <b-tab-item icon="plus" label="Agregar">
          <agregar-conejo />
        </b-tab-item>
        <b-tab-item icon="rabbit" label="Conejos">
          <conejos />
        </b-tab-item>
        <b-tab-item label="Acerca de">
          <conejos />
        </b-tab-item>
      </b-tabs>
</template>
<script>
import AgregarConejo from "./Conejos/AgregarConejo.vue";
import Conejos from "./Conejos/Conejos.vue";
export default {
  components: { AgregarConejo, Conejos },
  data: () => ({
    tabActiva: 1,
  }),
};
</script>