<template>
  <div class="container">
    <div class="columns">
      <div class="column">
        <section>
          <h1 class="is-size-1">Probando Buefy</h1>
          <button class="button is-medium" @click="mostrarToast">
            Mostrar un toast
          </button>
        </section>
      </div>
    </div>
    <agregar-conejo />
  </div>
</template>

<script>
import AgregarConejo from "./components/Conejos/AgregarConejo.vue";
export default {
  components: { AgregarConejo },
  name: "app",
  methods: {
    mostrarToast() {
      this.$buefy.toast.open("¡Hola, Buefy! Parzibyte.me");
    },
  },
};
</script>