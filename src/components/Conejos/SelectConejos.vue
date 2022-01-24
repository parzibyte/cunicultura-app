<template>
  <b-select
    :loading="cargando"
    @input="onCambiado"
    v-model="conejoSeleccionadoInterno"
    :placeholder="placeholder()"
  >
    <option v-for="conejo in conejos" :value="conejo" :key="conejo.id">
      {{ conejo.identificador }}
    </option>
  </b-select>
</template>
<script>
/**
 * El idForzarSeleccion es una propiedad que, si está establecida, forzará la selección de ese conejo
 * Sirve para indicarle a este componente (desde el padre) que debe seleccionar un ID ya sea tan pronto
 * los datos estén listos o cuando la propiedad cambie (mira el watch en el idForzarSeleccion, y el
 * método obtenerConejosYEscucharCambios)
 * Nota: el v-model conejoSeleccionadoInterno es para tener una variable distinta a "conejoSeleccionado" ya que
 * ésta última se usa con .sync en el padre y no queremos modificarla desde el hijo, pero al modificar conejoSeleccionadoInterno
 * se cambia también en el padre
 */
import ConejosService from "../../services/ConejosService";
export default {
  props: ["conejoSeleccionado", "genero", "idForzarSeleccion"],
  data: () => ({
    cargando: false,
    conejos: [],
    conejoSeleccionadoInterno: {},
  }),
  async mounted() {
    await this.obtenerConejosYEscucharCambios();
  },
  watch: {
    idForzarSeleccion() {
      if (this.idForzarSeleccion) {
        this.seleccionarConejoConId(this.idForzarSeleccion);
      }
    },
  },
  methods: {
    placeholder() {
      if (this.genero === "M") {
        return "Seleccione un conejo";
      } else {
        return "Selecciona una coneja";
      }
    },
    onCambiado(conejo) {
      this.$emit("update:conejoSeleccionado", conejo);
    },
    seleccionarConejoConId(id) {
      const indice = this.conejos.findIndex((conejo) => conejo.id === id);
      if (indice !== -1) {
        this.conejoSeleccionadoInterno = this.conejos[indice];
      }
    },
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
    async obtenerConejosYEscucharCambios() {
      this.cargando = true;
      ConejosService.obtenerConejosConGenero(this.genero, (instantanea) => {
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
        this.seleccionarConejoConId(this.idForzarSeleccion);
        this.cargando = false;
      });
    },
  },
};
</script>