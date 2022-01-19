<template>
  <div>
    <b-loading :is-full-page="false" v-model="cargando" :can-cancel="true"></b-loading>
    <img @click="ampliarImagen" v-show="url" :src="url" alt="" />
    <b-modal @after-leave="onModalCerrado" v-model="mostrarModal">
      <p class="image">
        <img :src="url" />
      </p>
    </b-modal>
  </div>
</template>
<script>
import { getDownloadURL, getStorage, ref } from "firebase/storage";
export default {
  props: ["conejo", "foto"],
  data: () => ({
    url: "",
    mostrarModal: false,
    click: false,
    cargando: false,
  }),
  async mounted() {
    this.cargando = true;
    this.url = await getDownloadURL(
      ref(getStorage(), `conejos/${this.conejo.identificador}/${this.foto}`)
    );
    this.cargando = false;
  },
  methods: {
    onModalCerrado() {
      this.click = false;
    },
    ampliarImagen() {
      /*
            El clic, extrañamente, se llama dos veces. Esta bandera es para que ya no se desencadene,
            pero incluso así no funciona. A veces no se muestra el modal ni porque le des 1000 clics, así que mejor lo 
            dejo así en lugar de seguir perdiendo el tiempo
        */
      if (!this.click) {
        this.mostrarModal = true;
        this.click = true;
      }
    },
  },
};
</script>