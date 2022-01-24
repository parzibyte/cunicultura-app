<template>
  <div class="section">
    <div class="columns">
      <div class="column">
        <b-button type="is-info" @click="volver" icon-left="arrow-left"
          >Volver
        </b-button>
        <br />
        <br />
        <b-notification type="is-success" :closable="false">
          <strong>Coneja: </strong> {{ coneja.identificador }}
        </b-notification>
        <b-field label="Padre">
          <select-conejos
            genero="M"
            :conejoSeleccionado.sync="apareamiento.padre"
          />
        </b-field>
        <b-field label="Fecha de inicio">
          <b-datepicker
            v-model="apareamiento.fechaInicio"
            locale="es-MX"
            placeholder="Clic para seleccionar..."
            icon="calendar-today"
            trap-focus
            :icon-right="apareamiento.fechaInicio ? 'close-circle' : ''"
            icon-right-clickable
            @icon-right-click="conejo.fechaInicio = null"
          >
          </b-datepicker>
        </b-field>
        <b-button :loading="cargando" type="is-success" @click="guardar"
          >Guardar</b-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { addDoc } from "firebase/firestore";
import BaseDeDatosService from "../../../services/BaseDeDatosService";
import SelectConejos from "../SelectConejos.vue";
import ConejosService from "../../../services/ConejosService";
export default {
  components: { SelectConejos },
  data: () => ({
    coleccionConejos: null,
    apareamiento: {
      padre: null,
      fechaInicio: new Date(),
    },
    cargando: false,
    coneja: {},
  }),
  async mounted() {
    await this.obtenerConeja();
    this.coleccionConejos = await BaseDeDatosService.obtenerColeccionConejos();
  },
  methods: {
    async obtenerConeja() {
      this.cargando = true;
      try {
        this.coneja = await ConejosService.obtenerConejoPorId(
          this.$route.params.id
        );
      } catch (e) {
        this.$buefy.toast.open("Error obteniendo coneja por id");
      } finally {
        this.cargando = false;
      }
    },
    async guardar() {
      if (!this.apareamiento.padre || !this.apareamiento.fechaInicio) {
        return;
      }
      const apareamiento = Object.assign({}, this.apareamiento);
      apareamiento.fechaFin = null;
      apareamiento.fechaInicio = apareamiento.fechaInicio.setHours(0, 0, 0, 0);
      apareamiento.padre = apareamiento.padre.id;
      apareamiento.madre = this.$route.params.id;
      addDoc(
        await BaseDeDatosService.obtenerColeccionApareamientos(),
        apareamiento
      );
      this.$buefy.toast.open("Guardado");
    },
    volver() {
      this.$router.go(-1);
    },
  },
};
</script>