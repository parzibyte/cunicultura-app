<template>
  <div class="section">
    <div class="columns">
      <b-modal :active.sync="mostrarModalFecha" has-modal-card trap-focus>
        <seleccionador-fecha @seleccionada="onFechaSeleccionada" />
      </b-modal>
      <div class="column">
        <b-button
          :loading="cargando"
          type="is-info"
          @click="volver"
          icon-left="arrow-left"
          >Volver
        </b-button>
        &nbsp;
        <b-button
          :loading="cargando"
          type="is-success"
          @click="agregar"
          icon-left="plus"
          >Agregar
        </b-button>
        <br /><br />
        <b-notification type="is-success" :closable="false">
          <strong>Coneja: </strong> {{ coneja.identificador }}
        </b-notification>
        <b-table
          :data="apareamientos"
          :loading="cargando"
          :mobile-cards="true"
          hoverable
        >
          <b-table-column field="padre" label="Padre" v-slot="props">
            {{ conejoPorId(props.row.padre).identificador }}
          </b-table-column>
          <b-table-column label="Inicio" v-slot="props">
            {{ props.row.fechaInicio | timestampAFecha }}
            <span v-show="!props.row.fechaFin"
              >({{ props.row.fechaInicio | edad }})</span
            >
            <span v-show="props.row.fechaFin"
              >({{
                (props.row.fechaFin - props.row.fechaInicio) | diferenciaAEdad
              }})</span
            >
          </b-table-column>

          <b-table-column field="fechaFin" label="Fin" v-slot="props">
            {{ props.row.fechaFin | timestampAFecha }}
            <b-button
              type="is-info"
              v-show="!props.row.fechaFin"
              @click="marcarFin(props.row)"
            >
              Marcar fin
            </b-button>
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">No hay registros</div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
import { doc, onSnapshot, query, updateDoc, where } from "@firebase/firestore";
import BaseDeDatosService from "../../../services/BaseDeDatosService";
import SeleccionadorFecha from "./SeleccionadorFecha.vue";
import ConejosService from "../../../services/ConejosService";
export default {
  components: { SeleccionadorFecha },
  data: () => ({
    cargando: false,
    apareamientos: [],
    conejos: [],
    coneja: {},
    mostrarModalFecha: false,
    apareamientoSeleccionado: null,
  }),
  async mounted() {
    await this.obtenerConeja();
    await this.obtenerConejosYEscucharCambios();
    await this.obtenerApareamientos();
  },
  methods: {
    marcarFin(apareamiento) {
      this.apareamientoSeleccionado = apareamiento;
      this.mostrarModalFecha = true;
    },
    async onFechaSeleccionada(fecha) {
      this.cargando = true;
      this.mostrarModalFecha = false;
      const apareamiento = Object.assign({}, this.apareamientoSeleccionado);
      apareamiento.fechaFin = fecha.setHours(0, 0, 0, 0);
      updateDoc(
        doc(
          await BaseDeDatosService.obtener(),
          "apareamientos",
          this.apareamientoSeleccionado.id
        ),
        apareamiento
      );
      this.cargando = false;
    },
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
      this.cargando = false;
    },
    conejoPorId(id) {
      for (const conejo of this.conejos) {
        if (conejo.id === id) {
          return conejo;
        }
      }
      return {};
    },
    async obtenerConejosYEscucharCambios() {
      this.cargando = true;
      const instantanea = await ConejosService.obtenerConejosConGenero("M");
      instantanea.docChanges().forEach((cambio) => {
        this.cargando = true;
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
    },
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
    indiceDeApareamiento(idApareamiento) {
      return this.apareamientos.findIndex(
        (apareamiento) => apareamiento.id === idApareamiento
      );
    },
    volver() {
      this.$router.go(-1);
    },
    agregar() {
      this.$router.push({
        name: "AgregarApareamiento",
        params: { id: this.$route.params.id },
      });
    },
    async obtenerApareamientos() {
      this.cargando = true;
      const consulta = query(
        await BaseDeDatosService.obtenerColeccionApareamientos(),
        where("madre", "==", this.$route.params.id)
      );
      onSnapshot(consulta, (instantanea) => {
        instantanea.docChanges().forEach((cambio) => {
          this.cargando = true;
          const apareamiento = cambio.doc.data();
          const idApareamiento = cambio.doc.id;
          if (cambio.type === "added") {
            apareamiento.id = idApareamiento;
            this.apareamientos.push(apareamiento);
          }
          if (cambio.type === "modified") {
            const indice = this.indiceDeApareamiento(idApareamiento);
            if (indice !== -1) {
              this.$set(this.apareamientos, indice, apareamiento);
            }
          }
          if (cambio.type === "removed") {
            const indice = this.indiceDeApareamiento(idApareamiento);
            if (indice !== -1) {
              this.apareamientos.splice(indice, 1);
            }
          }
        });
        this.cargando = false;
      });
    },
  },
};
</script>