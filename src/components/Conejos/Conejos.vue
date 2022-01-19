<template>
  <div class="columns">
    <div class="column">
      <p>Somos los conejos</p>
      <b-table
        :data="conejos"
        :loading="cargando"
        :mobile-cards="true"
        hoverable
      >
        <b-table-column
          field="identificador"
          label="Identificador"
          v-slot="props"
        >
          {{ props.row.identificador }}
        </b-table-column>
        <b-table-column field="padre" label="Padres" v-slot="props">
          <b-tag
            size="is-medium"
            v-show="props.row.madre"
            class="color-coneja"
            >{{ props.row.madre }}</b-tag
          >
          &nbsp;
          <b-tag
            v-show="props.row.padre"
            size="is-medium"
            class="color-conejo"
            >{{ props.row.padre }}</b-tag
          >
        </b-table-column>
        <b-table-column field="fotos" v-slot="props">
          <fotos-de-conejo :conejo="props.row" />
        </b-table-column>
        <b-table-column field="fechaNacimiento" v-slot="props">
          {{ props.row.fechaNacimiento | timestampAFecha }}
        </b-table-column>
        <b-table-column field="id" label="Opciones" v-slot="props">
          <b-button type="is-info" @click="eliminar(props.row)">
            <b-icon icon="delete"></b-icon
          ></b-button>
          <b-tag v-show="props.row.eliminada" type="is-success"
            >Liquidada</b-tag
          >
        </b-table-column>
        <template #empty>
          <div class="has-text-centered">No hay registros</div>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { onSnapshot, query } from "firebase/firestore";
import BaseDeDatosService from "../../services/BaseDeDatosService";
import FotosDeConejo from "./FotosDeConejo.vue";
export default {
  components: { FotosDeConejo },
  data: () => ({
    conejos: [],
    cargando: false,
  }),
  async mounted() {
    await this.obtenerConejosYEscucharCambios();
  },
  methods: {
    async obtenerConejosYEscucharCambios() {
      this.cargando = true;
      const consulta = query(
        await BaseDeDatosService.obtenerColeccionConejos()
      );
      onSnapshot(consulta, (instantanea) => {
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
      });
      this.cargando = false;
    },
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
  },
};
</script>
<style scoped>
.color-coneja {
  background-color: #ec407a;
  color: white;
}
.color-conejo {
  background-color: #0d47a1;
  color: white;
}
</style>