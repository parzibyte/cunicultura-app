<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>
<style>
@media screen and (max-width: 768px) {
  .section {
    padding: 0.5em !important;
  }
  .columns {
    max-width: 100% !important;
  }
}
</style>