<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="control">
          <b-button
            @click="mostrarFiltros = !mostrarFiltros"
            icon-right="filter-variant"
            type="is-info"
            >Filtrar</b-button
          >
          &nbsp;
          <b-taglist attached style="display: inline">
            <b-tag size="is-medium" class="color-conejo">
              <b-icon icon="gender-male"></b-icon>
              {{ totalMachos() }}</b-tag
            >
            <b-tag size="is-medium" class="color-coneja">
              <b-icon icon="gender-female"></b-icon>
              {{ totalHembras() }}</b-tag
            >
            <b-tag size="is-medium" type="is-warning">
              <b-icon icon="sigma"></b-icon>
              {{ totalMachos() + totalHembras() }}</b-tag
            >
          </b-taglist>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column" v-show="mostrarFiltros">
        <b-field label="Estado">
          <b-select
            :loading="cargando"
            expanded
            icon="coffin"
            @change.native="obtenerConejosYEscucharCambios()"
            v-model="filtrosSeleccionados.fallecidos"
          >
            <option
              v-for="estado in filtros.fallecidos"
              :value="estado"
              :key="estado"
            >
              {{ estado }}
            </option>
          </b-select>
        </b-field>
        <b-field>
          <b-select
            :loading="cargando"
            expanded
            icon="cash"
            @change.native="obtenerConejosYEscucharCambios()"
            v-model="filtrosSeleccionados.vendidos"
          >
            <option
              v-for="estado in filtros.vendidos"
              :value="estado"
              :key="estado"
            >
              {{ estado }}
            </option>
          </b-select>
        </b-field>
        <b-field label="Género">
          <b-select
            :loading="cargando"
            expanded
            icon="gender-male"
            @change.native="obtenerConejosYEscucharCambios()"
            v-model="filtrosSeleccionados.genero"
          >
            <option
              v-for="estado in filtros.generos"
              :value="estado"
              :key="estado"
            >
              {{ estado }}
            </option>
          </b-select>
        </b-field>
      </div>
    </div>
    <div class="columns">
      <div class="column">
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
          <b-table-column field="genero" label="Género" v-slot="props">
            <b-icon
              v-show="props.row.genero === 'H'"
              class="icono-coneja"
              icon="gender-female"
            ></b-icon>
            <b-icon
              v-show="props.row.genero === 'M'"
              class="icono-conejo"
              icon="gender-male"
            ></b-icon>
          </b-table-column>
          <b-table-column field="padre" label="Padres" v-slot="props">
            <b-tag
              size="is-medium"
              v-show="props.row.madre.identificador"
              class="color-coneja"
              >{{ props.row.madre.identificador }}</b-tag
            >
            &nbsp;
            <b-tag
              v-show="props.row.padre.identificador"
              size="is-medium"
              class="color-conejo"
              >{{ props.row.padre.identificador }}</b-tag
            >
          </b-table-column>
          <b-table-column field="fotos" v-slot="props">
            <fotos-de-conejo :conejo="props.row" />
          </b-table-column>
          <b-table-column label="Edad" v-slot="props">
            {{ props.row.fechaNacimiento | timestampAFecha }}
            <span v-show="props.row.fechaFallecimiento">
              - {{ props.row.fechaFallecimiento | timestampAFecha }}
              <b-icon icon="coffin"></b-icon>
            </span>
            <span v-if="!props.row.fechaFallecimiento">
              ({{ props.row.fechaNacimiento | edad }})
            </span>
            <span v-else
              >({{
                (props.row.fechaFallecimiento - props.row.fechaNacimiento)
                  | diferenciaAEdad
              }})</span
            >
          </b-table-column>
          <b-table-column field="id" label="Opciones" v-slot="props">
            <b-button
              v-show="!props.row.fechaFallecimiento && !props.row.vendido"
              type="is-info"
              @click="editar(props.row)"
            >
              <b-icon icon="pencil"></b-icon
            ></b-button>
            &nbsp;
            <b-button
              v-show="
                !props.row.fechaFallecimiento &&
                !props.row.vendido &&
                props.row.genero === 'H'
              "
              type="is-danger"
              outlined
              @click="apareamientos(props.row)"
            >
              <b-icon icon="heart"></b-icon
            ></b-button>
            &nbsp;
            <b-button
              v-show="!props.row.fechaFallecimiento && !props.row.vendido"
              type="is-success"
              @click="marcarVendido(props.row)"
            >
              <b-icon icon="cash"></b-icon
            ></b-button>
            &nbsp;
            <b-button
              v-show="!props.row.fechaFallecimiento && !props.row.vendido"
              type="is-warning"
              @click="marcarFallecido(props.row)"
            >
              <b-icon icon="coffin"></b-icon
            ></b-button>
            &nbsp;
            <b-button type="is-danger" @click="eliminar(props.row)">
              <b-icon icon="delete"></b-icon
            ></b-button>
            &nbsp;
            <b-tag v-show="props.row.vendido" type="is-success">
              Vendido
            </b-tag>
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
import { deleteDoc, doc, updateDoc, addDoc, where } from "firebase/firestore";
import BaseDeDatosService from "../../services/BaseDeDatosService";
import FotosDeConejo from "./FotosDeConejo.vue";
import { deleteObject,  } from "firebase/storage";
import ConejosService from "../../services/ConejosService";
const FallecimientoFallecido = "Fallecidos",
  FallecimientoVivo = "Vivos",
  FallecimientoTodos = "Todos",
  VendidoVendido = "Vendidos",
  VendidoNoVendido = "No vendidos",
  VendidoTodos = "Todos",
  GeneroTodos = "Todos",
  GeneroHembra = "H",
  GeneroMacho = "M";
export default {
  components: { FotosDeConejo },
  data: () => ({
    mostrarFiltros: false,
    filtrosSeleccionados: {
      fallecidos: FallecimientoVivo,
      vendidos: VendidoNoVendido,
      genero: GeneroTodos,
    },
    filtros: {
      fallecidos: [
        FallecimientoFallecido,
        FallecimientoVivo,
        FallecimientoTodos,
      ],
      vendidos: [VendidoVendido, VendidoNoVendido, VendidoTodos],
      generos: [GeneroMacho, GeneroHembra, GeneroTodos],
    },
    conejos: [],
    cargando: false,
    bd: null,
  }),
  async mounted() {
    this.bd = await BaseDeDatosService.obtener();
    await this.obtenerConejosYEscucharCambios();
  },
  methods: {
    editar(conejo) {
      this.$router.push({
        name: "EditarConejo",
        params: { id: conejo.id },
      });
    },
    totalMachos() {
      let total = 0;
      for (const conejo of this.conejos) {
        if (conejo.genero === GeneroMacho) {
          total++;
        }
      }
      return total;
    },
    totalHembras() {
      let total = 0;
      for (const conejo of this.conejos) {
        if (conejo.genero === GeneroHembra) {
          total++;
        }
      }
      return total;
    },
    apareamientos(conejo) {
      this.$router.push({
        name: "Apareamientos",
        params: {
          id: conejo.id,
        },
      });
    },
    marcarFallecido(conejo) {
      this.$buefy.dialog.confirm({
        message: `¿Marcar como fallecido? Esto no se puede deshacer`,
        cancelText: "Cancelar",
        confirmText: "Sí, marcar",
        onConfirm: async () => {
          conejo.fechaFallecimiento = new Date().setHours(0, 0, 0, 0);
          updateDoc(doc(this.bd, "conejos", conejo.id), conejo);
        },
      });
    },
    marcarVendido(conejo) {
      this.$buefy.dialog.prompt({
        message: "Ingresa la cantidad: ",
        inputAttrs: {
          type: "number",
          placeholder: "Escribe la cantidad",
          min: 1,
        },
        trapFocus: true,
        onConfirm: async (monto) => {
          monto = parseFloat(monto);
          conejo.vendido = true;
          addDoc(await BaseDeDatosService.obtenerColeccionVentas(), {
            monto,
            idConejo: conejo.id,
            fecha: new Date().getTime(),
          });
          updateDoc(doc(this.bd, "conejos", conejo.id), conejo);
          this.$buefy.toast.open("Vendido");
        },
      });
    },
    async eliminar(conejo) {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar conejo? Esto no se puede deshacer`,
        cancelText: "Cancelar",
        confirmText: "Sí, eliminar",
        onConfirm: async () => {
          this.cargando = true;
          for (const foto of conejo.fotos) {
            await deleteObject(
              await ConejosService.obtenerReferenciaParaFoto(
                conejo.identificador,
                foto
              )
            );
          }
          await deleteDoc(
            doc(await BaseDeDatosService.obtener(), "conejos", conejo.id)
          );
          this.cargando = false;
          this.$buefy.toast.open("Eliminado");
        },
      });
    },
    async obtenerConejosYEscucharCambios() {
      this.conejos = [];
      const consultas = [];
      if (this.filtrosSeleccionados.fallecidos === FallecimientoVivo) {
        consultas.push(where("fechaFallecimiento", "==", null));
      } else if (
        this.filtrosSeleccionados.fallecidos === FallecimientoFallecido
      ) {
        consultas.push(where("fechaFallecimiento", "!=", null));
      }

      if (this.filtrosSeleccionados.vendidos === VendidoVendido) {
        consultas.push(where("vendido", "==", true));
      } else if (this.filtrosSeleccionados.vendidos === VendidoNoVendido) {
        consultas.push(where("vendido", "==", false));
      }
      if (this.filtrosSeleccionados.genero === GeneroHembra) {
        consultas.push(where("genero", "==", "H"));
      } else if (this.filtrosSeleccionados.genero === GeneroMacho) {
        consultas.push(where("genero", "==", "M"));
      }
      this.cargando = true;
      ConejosService.obtenerConejosUsandoConsultas(consultas, (instantanea) => {
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
      });
    },
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
  },
};
</script>
<style scoped>
.color-coneja {
  background-color: #ec407a !important;
  color: white;
}
.color-conejo {
  background-color: #0d47a1 !important;
  color: white;
}
.icono-coneja {
  color: #ec407a;
}
.icono-conejo {
  color: #0d47a1;
}
</style>