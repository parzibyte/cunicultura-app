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
    <b-tab-item icon="logout">
      <section class="section">
        <h3 class="is-size-3">Cerrando sesión...</h3>
        <b-loading :is-full-page="false" :active="true"></b-loading>
      </section>
    </b-tab-item>
  </b-tabs>
</template>
<script>
import AgregarConejo from "./Conejos/AgregarConejo.vue";
import Conejos from "./Conejos/Conejos.vue";
import AcercaDe from "./AcercaDe.vue";
import Ventas from "./Ventas/Ventas.vue";
import { getAuth, signOut } from "@firebase/auth";
export default {
  components: { AgregarConejo, Conejos, AcercaDe, Ventas },
  data: () => ({
    tabActiva: 1,
  }),
  watch: {
    async tabActiva() {
      if (this.tabActiva === 4) {
        try {
          await signOut(getAuth());
          this.$buefy.toast.open("Hasta pronto");
        } catch (e) {
          this.$buefy.toast.open("Error cerrando sesión: " + e.message);
        }
      }
    },
  },
};
</script>