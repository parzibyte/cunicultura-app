<template>
  <div class="section">
    <div class="columns">
      <div class="column">
        <b-button type="is-info" @click="volver" icon-left="arrow-left"
          >Volver
        </b-button>
        <p>Apareamiento</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    volver() {
      this.$router.go(-1);
    },
  },
};
</script>