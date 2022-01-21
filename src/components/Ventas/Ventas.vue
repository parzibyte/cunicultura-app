<template>
  <div class="section">
    <div class="columns">
      <div class="column">
        <b-table
          :data="ventas"
          :loading="cargando"
          :mobile-cards="true"
          hoverable
        >
          <b-table-column field="idConejo" label="Conejo" v-slot="props">
            {{ conejoPorId(props.row.idConejo).identificador }}
          </b-table-column>
          <b-table-column field="monto" label="Monto" v-slot="props">
            {{ props.row.monto | dinero }} </b-table-column
          ><b-table-column field="padre" label="Fecha" v-slot="props">
            {{ props.row.fecha | timestampAFecha }}
          </b-table-column>
          <template #empty>
            <div class="has-text-centered">No hay registros</div>
          </template>
          <template #footer>
            <th >
              <div class="th-wrap">Total</div>
            </th>
            <th colspan="2">
              <div class="th-wrap">{{ total() | dinero }}</div>
            </th>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>
<script>
import { onSnapshot, query, where } from "firebase/firestore";
import BaseDeDatosService from "../../services/BaseDeDatosService";
export default {
  data: () => ({
    ventas: [],
    cargando: false,
    conejos: [],
  }),
  async mounted() {
    await this.obtenerConejosYEscucharCambios();
    await this.obtenerVentasYEscucharCambios();
  },
  methods: {
    total() {
      let total = 0;
      for (const venta of this.ventas) {
        total += venta.monto;
      }
      return total;
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
      const consulta = query(
        await BaseDeDatosService.obtenerColeccionConejos(),
        where("fechaFallecimiento", "==", null)
      );
      onSnapshot(consulta, (instantanea) => {
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
    indiceDeVenta(idVenta) {
      return this.ventas.findIndex((venta) => venta.id === idVenta);
    },
    async obtenerVentasYEscucharCambios() {
      this.cargando = true;
      const consulta = query(await BaseDeDatosService.obtenerColeccionVentas());
      onSnapshot(consulta, (instantanea) => {
        instantanea.docChanges().forEach((cambio) => {
          this.cargando = true;
          const venta = cambio.doc.data();
          const idVenta = cambio.doc.id;
          if (cambio.type === "added") {
            venta.id = idVenta;
            this.ventas.push(venta);
          }
          if (cambio.type === "modified") {
            const indice = this.indiceDeVenta(idVenta);
            if (indice !== -1) {
              this.$set(this.ventas, indice, venta);
            }
          }
          if (cambio.type === "removed") {
            const indice = this.indiceDeVenta(idVenta);
            if (indice !== -1) {
              this.ventas.splice(indice, 1);
            }
          }
        });
        this.cargando = false;
      });
    },
  },
};
</script>