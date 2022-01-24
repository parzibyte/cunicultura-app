<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <b-field label="Padre">
          <select-conejos
            ref="select"
            :idForzarSeleccion="idPadre"
            genero="M"
            :conejoSeleccionado.sync="conejo.padre"
          />
        </b-field>
        <b-field label="Madre">
          <select-conejos
            :idForzarSeleccion="idMadre"
            ref="selectMadre"
            genero="H"
            :conejoSeleccionado.sync="conejo.madre"
          />
        </b-field>
        <b-field label="Identificador">
          <b-input
            readonly
            v-model="conejo.identificador"
            placeholder="Identificador"
          ></b-input>
        </b-field>
        <b-field label="Género">
          <b-radio v-model="conejo.genero" name="name" native-value="M">
            Macho
          </b-radio>
          <b-radio v-model="conejo.genero" name="name" native-value="H">
            Hembra
          </b-radio>
        </b-field>
        <b-field label="Fecha de nacimiento">
          <b-datepicker
            v-model="conejo.fechaNacimiento"
            locale="es-MX"
            placeholder="Clic para seleccionar..."
            icon="calendar-today"
            trap-focus
            :icon-right="conejo.fechaNacimiento ? 'close-circle' : ''"
            icon-right-clickable
            @icon-right-click="conejo.fechaNacimiento = null"
          >
          </b-datepicker>
        </b-field>
        <b-field>
          <b-upload v-model="fotosParaAgregar" multiple drag-drop expanded>
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large"></b-icon>
                </p>
                <p>Clic aquí para buscar las fotos</p>
              </div>
            </section>
          </b-upload>
        </b-field>
        <div class="tags">
          <span
            v-for="(archivo, indice) in fotosParaAgregar"
            :key="indice"
            class="tag is-primary"
          >
            {{ archivo.name }}
          </span>
        </div>
        <p>Existentes:</p>
        <div class="tags">
          <span
            v-for="(archivo, indice) in conejo.fotos"
            :key="indice"
            class="tag is-warning"
          >
            {{ archivo }}
            <button
              class="delete is-small"
              type="button"
              @click="eliminarFoto(archivo, indice)"
            ></button>
          </span>
        </div>
        <b-button :loading="cargando" @click="guardar()" type="is-success"
          >Guardar</b-button
        >
        &nbsp;
        <b-button :loading="cargando" @click="volver()" type="is-info"
          >Volver</b-button
        >
      </div>
    </div>
  </section>
</template>
<script>
import BaseDeDatosService from "../../services/BaseDeDatosService";
import UtilesService from "../../services/UtilesService";
import { deleteObject, uploadBytes } from "firebase/storage";
import SelectConejos from "./SelectConejos.vue";
import ConejosService from "../../services/ConejosService";
export default {
  components: { SelectConejos },
  async mounted() {
    this.cargando = true;
    const conejo = await ConejosService.obtenerConejoPorId(
      this.$route.params.id
    );
    if (conejo.fechaNacimiento) {
      conejo.fechaNacimiento = new Date(conejo.fechaNacimiento);
    }
    this.conejo = conejo;
    this.idPadre = conejo.padre.id;
    this.idMadre = conejo.madre.id;
    this.coleccionConejos = await BaseDeDatosService.obtenerColeccionConejos();
    this.cargando = false;
  },
  data: () => ({
    idPadre: null,
    idMadre: null,
    conejo: {
      padre: {},
      madre: {},
      identificador: "",
      fechaNacimiento: null,
      fotos: [],
      genero: "M",
    },
    fotosParaAgregar: [],
    cargando: false,
    coleccionConejos: null,
  }),
  methods: {
    volver() {
      this.$router.go(-1);
    },
    eliminarFoto(archivo, indice) {
      this.$buefy.dialog.confirm({
        message: `¿Eliminar foto? Esto no se puede deshacer`,
        cancelText: "Cancelar",
        confirmText: "Sí, eliminar",
        onConfirm: async () => {
          this.cargando = true;
          await deleteObject(
            await ConejosService.obtenerReferenciaParaFoto(
              this.conejo.identificador,
              archivo
            )
          );
          this.conejo.fotos.splice(indice, 1);
          await ConejosService.actualizarConejo(this.conejo.id, {
            fotos: this.conejo.fotos,
          });
          this.cargando = false;
          this.$buefy.toast.open("Eliminada");
        },
      });
    },
    async guardar() {
      this.cargando = true;
      const conejo = Object.assign({}, this.conejo);
      Object.assign(conejo, this.conejo);
      const fotos = this.fotosParaAgregar;
      if (conejo.fechaNacimiento) {
        conejo.fechaNacimiento.setHours(0, 0, 0, 0);
        conejo.fechaNacimiento = conejo.fechaNacimiento.getTime();
      }
      if (conejo.padre) {
        conejo.padre = {
          id: conejo.padre.id,
          identificador: conejo.padre.identificador,
        };
      } else {
        conejo.padre = {};
      }
      if (conejo.madre) {
        conejo.madre = {
          id: conejo.madre.id,
          identificador: conejo.madre.identificador,
        };
      } else {
        conejo.madre = {};
      }
      if (fotos.length > 0) {
        for (const foto of fotos) {
          conejo.fotos.push(foto.name);
          const referenciaFoto = await ConejosService.obtenerReferenciaParaFoto(
            conejo.identificador,
            foto.name
          );
          await uploadBytes(
            referenciaFoto,
            await UtilesService.comprimirImagen(foto, 20)
          );
        }
      }
      await ConejosService.actualizarConejo(conejo.id, conejo);
      this.cargando = false;
      this.$buefy.toast.open("Actualizado correctamente");
      this.volver();
    },
  },
};
</script>