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
          <b-select
            :loading="cargando"
            placeholder="Seleccione un conejo"
            v-model="apareamiento.padre"
          >
            <option v-for="conejo in conejos" :value="conejo" :key="conejo.id">
              {{ conejo.identificador }}
            </option>
          </b-select>
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
import {
  addDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import BaseDeDatosService from "../../../services/BaseDeDatosService";
export default {
  data: () => ({
    coleccionConejos: null,
    apareamiento: {
      padre: null,
      fechaInicio: new Date(),
    },
    conejos: [],
    cargando: false,
    coneja: {},
  }),
  async mounted() {
    await this.obtenerConeja();
    this.coleccionConejos = await BaseDeDatosService.obtenerColeccionConejos();
    await this.obtenerConejosYEscucharCambios();
  },
  methods: {
    async obtenerConeja() {
      this.cargando = true;
      const instantaneaDocumento = await getDoc(
        doc(
          await BaseDeDatosService.obtener(),
          "conejos",
          this.$route.params.id
        )
      );
      if (instantaneaDocumento.exists()) {
        this.coneja = instantaneaDocumento.data();
      } else {
        this.$buefy.toast.open("Error obteniendo coneja por id");
      }
      this.cargando = false;
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
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
    async obtenerConejosYEscucharCambios() {
      const consulta = query(
        this.coleccionConejos,
        where("genero", "==", "M"),
        where("fechaFallecimiento", "==", null),
        where("vendido", "==", false)
      );
      onSnapshot(consulta, (instantanea) => {
        this.cargando = true;
        instantanea.docChanges().forEach((cambio) => {
          const conejo = cambio.doc.data();
          const idConejo = cambio.doc.id;
          if (cambio.type === "added") {
            conejo.id = idConejo;
            this.conejos.push(conejo);
          }
          if (cambio.type === "modified") {
            const indice = this.indiceDeConejo(idConejo);
            if (indice !== -1) {
              this.$set(this.conejos, indice, conejo);
            }
          }
          if (cambio.type === "removed") {
            const indice = this.indiceDeConejo(idConejo);
            if (indice !== -1) {
              this.conejos.splice(indice, 1);
            }
          }
        });
        this.cargando = false;
      });
    },
    volver() {
      this.$router.go(-1);
    },
  },
};
</script>