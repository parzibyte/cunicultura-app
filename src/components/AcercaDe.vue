<template>
  <section class="hero is-medium is-info">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Acerca de</h1>
        <img title="El conejo pinto" class="image" :src="Pinto" />
        <h2 class="subtitle">App para cunicultura</h2>

        Creado y mantenido con
        <b-icon icon="heart" type="is-danger"></b-icon>
        por
        <a
          target="_blank"
          class="has-text-warning"
          href="https://parzibyte.me/blog"
          >Parzibyte</a
        >
        usando
        <b-icon icon="vuejs"></b-icon>
        y
        <b-icon icon="firebase"></b-icon>
        <br />
        <a
          target="_blank"
          class="has-text-warning"
          href="https://parzibyte.me/blog/sigueme/"
          >Puedes seguirme aquí</a
        >
        y ver
        <a
          class="has-text-warning"
          href="https://parzibyte.me/blog/software-creado-por-parzibyte/"
          target="_blank"
          >más proyectos aquí</a
        >
        <hr />
        <h4 class="is-size-4">Créditos de iconos</h4>
        <a
          href="https://www.flaticon.com/free-icons/rabbit"
          title="rabbit icons"
          >Rabbit icons created by torskaya - Flaticon</a
        >
      </div>
    </div>
  </section>
</template>
<script>
import Pinto from "../assets/pinto.jpg";
export default {
  data: () => ({
    Pinto,
  }),
};
</script>