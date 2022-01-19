<template>
  <div class="container">
    <b-tabs type="is-boxed" position="is-centered" v-model="tabActiva">
      <b-tab-item icon="delete" label="Agregar">
        <agregar-conejo />
      </b-tab-item>
<b-tab-item icon="delete" label="Agregar">
        <agregar-conejo />
      </b-tab-item><b-tab-item icon="delete" label="Agregar">
        <agregar-conejo />
      </b-tab-item><b-tab-item icon="delete" label="Agregar">
        <agregar-conejo />
      </b-tab-item><b-tab-item icon="delete" label="Agregar">
        <agregar-conejo />
      </b-tab-item>
      <b-tab-item icon="rabbit" label="Conejos">
        <conejos />
      </b-tab-item>
      <b-tab-item label="Acerca de">
        <conejos />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import AgregarConejo from "./components/Conejos/AgregarConejo.vue";
import Conejos from "./components/Conejos/Conejos.vue";
export default {
  components: { AgregarConejo, Conejos },
  data: () => ({
    tabActiva: 0,
  }),
  name: "app",
  methods: {
    mostrarToast() {
      this.$buefy.toast.open("¡Hola, Buefy! Parzibyte.me");
    },
  },
};
</script>