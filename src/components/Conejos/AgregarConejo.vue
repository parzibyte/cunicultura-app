<template>
  <div class="columns">
    <div class="column">
      <b-field label="Padre">
        <select-conejos genero="M" :conejoSeleccionado.sync="conejo.padre" />
      </b-field>
      <b-field label="Madre">
        <select-conejos genero="H" :conejoSeleccionado.sync="conejo.padre" />
      </b-field>
      <b-field label="Identificador">
        <b-input
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
        <b-upload v-model="conejo.fotos" multiple drag-drop expanded>
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
          v-for="(archivo, indice) in conejo.fotos"
          :key="indice"
          class="tag is-primary"
        >
          {{ archivo.name }}
          <button
            class="delete is-small"
            type="button"
            @click="eliminarFoto(indice)"
          ></button>
        </span>
      </div>
      <b-button :loading="cargando" @click="guardar()" type="is-success"
        >Guardar</b-button
      >
    </div>
  </div>
</template>
<script>
import { addDoc } from "firebase/firestore";
import BaseDeDatosService from "../../services/BaseDeDatosService";
import UtilesService from "../../services/UtilesService";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import SelectConejos from "./SelectConejos.vue";
export default {
  components: { SelectConejos },
  async mounted() {
    this.cargando = true;
    this.coleccionConejos = await BaseDeDatosService.obtenerColeccionConejos();
    this.cargando = false;
  },
  data: () => ({
    conejo: {
      padre: null,
      madre: null,
      identificador: "",
      fechaNacimiento: null,
      fotos: [],
      genero: "M",
    },
    cargando: false,
    coleccionConejos: null,
  }),
  methods: {
    eliminarFoto(indice) {
      this.conejo.fotos.splice(indice, 1);
    },
    async guardar() {
      if (!this.conejo.identificador) {
        return;
      }
      this.cargando = true;
      const conejo = Object.assign({}, this.conejo);
      Object.assign(conejo, this.conejo);
      const { fotos } = conejo;
      conejo.fotos = [];
      conejo.fechaFallecimiento = null;
      conejo.vendido = false;
      if (conejo.fechaNacimiento) {
        conejo.fechaNacimiento.setHours(0, 0, 0, 0);
        conejo.fechaNacimiento = conejo.fechaNacimiento.getTime();
      }
      if (conejo.padre) {
        conejo.padre = conejo.padre.identificador;
      }
      if (conejo.madre) {
        conejo.madre = conejo.madre.identificador;
      }
      if (fotos.length > 0) {
        for (const foto of fotos) {
          conejo.fotos.push(foto.name);
          const referenciaFoto = ref(
            getStorage(),
            "conejos/" + conejo.identificador + "/" + foto.name
          );
          await uploadBytes(
            referenciaFoto,
            await UtilesService.comprimirImagen(foto, 20)
          );
        }
      }
      addDoc(this.coleccionConejos, conejo);
      this.cargando = false;
      this.$buefy.toast.open("Registro correcto");
      this.conejo.identificador = "";
      this.conejo.fechaNacimiento = null;
      this.conejo.fotos = [];
    },
  },
};
</script>