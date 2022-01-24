<template>
  <b-select
    :loading="cargando"
    @input="onCambiado"
    :placeholder="placeholder()"
  >
    <option v-for="conejo in conejos" :value="conejo" :key="conejo.id">
      {{ conejo.identificador }}
    </option>
  </b-select>
</template>
<script>
import ConejosService from "../../services/ConejosService";
export default {
  props: ["conejoSeleccionado", "genero"],
  data: () => ({
    cargando: false,
    conejos: [],
  }),
  async mounted() {
    await this.obtenerConejosYEscucharCambios();
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
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
    async obtenerConejosYEscucharCambios() {
      this.cargando = true;
      ConejosService.obtenerConejosConGenero(
        this.genero,
        (instantanea) => {
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
        }
      );
    },
  },
};
</script>