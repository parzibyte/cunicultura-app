<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Seleccione fecha</p>
    </header>
    <section class="modal-card-body">
      <b-datepicker
        inline
        v-model="fechaSeleccionada"
        locale="es-MX"
        placeholder="Clic para seleccionar"
        icon="calendar-today"
        trap-focus
      >
      </b-datepicker>
    </section>
    <footer class="modal-card-foot">
      <b-button @click="onFechaSeleccionada()" type="is-success">Ok</b-button>
      <b-button @click="cerrar()">Cancelar</b-button>
    </footer>
  </div>
</template>
<script>
export default {
  data: () => ({
    fechaSeleccionada: new Date(),
  }),
  methods: {
    cerrar() {
      this.$parent.close();
    },
    onFechaSeleccionada() {
      this.$emit("seleccionada", this.fechaSeleccionada);
    },
  },
};
</script>