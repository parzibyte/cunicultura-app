<template>
  <b-carousel
    style="max-width: 400px"
    :pause-info="false"
    v-show="conejo.fotos && conejo.fotos.length > 0"
  >
    <b-carousel-item
      @click.native.stop
      v-for="(foto, i) in conejo.fotos"
      :key="conejo.identificador + i"
    >
      <foto-de-conejo :conejo="conejo" :foto="foto" />
    </b-carousel-item>
  </b-carousel>
</template>
<script>
import FotoDeConejo from "./FotoDeConejo.vue";
export default {
  components: { FotoDeConejo },
  props: ["conejo"],
};
</script>