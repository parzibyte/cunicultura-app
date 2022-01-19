<template>
  <div class="columns">
    <div class="column">
      <b-field label="Padre">
        <b-select
          :loading="cargando"
          placeholder="Seleccione un conejo"
          v-model="conejo.padre"
        >
          <option v-for="conejo in conejos" :value="conejo" :key="conejo.id">
            {{ conejo.identificador }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Madre">
        <b-select
          :loading="cargando"
          placeholder="Seleccione una coneja"
          v-model="conejo.madre"
        >
          <option v-for="conejo in conejas" :value="conejo" :key="conejo.id">
            {{ conejo.identificador }}
          </option>
        </b-select>
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
import { onSnapshot, query, addDoc, where } from "firebase/firestore";
import BaseDeDatosService from "../../services/BaseDeDatosService";
import { getStorage, ref, uploadBytes } from "firebase/storage";
export default {
  async mounted() {
    this.cargando = true;
    this.coleccionConejos = await BaseDeDatosService.obtenerColeccionConejos();
    await this.obtenerConejosYEscucharCambios();
    await this.obtenerConejasYEscucharCambios();
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
    conejos: [],
    conejas: [],
    cargando: false,
    coleccionConejos: null,
  }),
  methods: {
    indiceDeConeja(idConeja) {
      return this.conejas.findIndex((coneja) => coneja.id === idConeja);
    },
    indiceDeConejo(idConejo) {
      return this.conejos.findIndex((conejo) => conejo.id === idConejo);
    },
    async obtenerConejosYEscucharCambios() {
      const consulta = query(this.coleccionConejos, where("genero", "==", "M"));
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
    async obtenerConejasYEscucharCambios() {
      const consulta = query(this.coleccionConejos, where("genero", "==", "H"));
      onSnapshot(consulta, (instantanea) => {
        this.cargando = true;
        instantanea.docChanges().forEach((cambio) => {
          const coneja = cambio.doc.data();
          const idConeja = cambio.doc.id;
          if (cambio.type === "added") {
            coneja.id = idConeja;
            this.conejas.push(coneja);
          }
          if (cambio.type === "modified") {
            const indice = this.indiceDeConeja(idConeja);
            if (indice !== -1) {
              this.$set(this.conejas, indice, coneja);
            }
          }
          if (cambio.type === "removed") {
            const indice = this.indiceDeConeja(idConeja);
            if (indice !== -1) {
              this.conejas.splice(indice, 1);
            }
          }
        });
        this.cargando = false;
      });
    },
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
      if (conejo.fechaNacimiento) {
        conejo.fechaNacimiento.setHours(0, 0, 0, 0);
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
          await uploadBytes(referenciaFoto, foto);
        }
      }
      if (conejo.fechaNacimiento) {
        conejo.fechaNacimiento = conejo.fechaNacimiento.getTime();
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