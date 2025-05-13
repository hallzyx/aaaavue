<script>
import SidebarComponent from "./app/public/components/sidebarComponent.vue";
import HeaderBar from "./app/public/components/headerComponent.vue";
import FooterComponent from "./app/public/components/footer.component.vue"; // Importamos el footer

export default {
  name: "App",
  components: {
    HeaderBar,
    SideBar: SidebarComponent,
    FooterComponent
  },
  methods: {},
  data() {
    return {
      isAuthPath: false,
      isSideBarVisible: true
    };
  }
};
</script>

<template>
  <div>
    <!-- Header y Sidebar -->
    <header-bar v-if="!isAuthPath" v-model:visible="isSideBarVisible" />
    <side-bar v-if="!isAuthPath" v-model:visible="isSideBarVisible" />
  </div>

  <!-- Contenido principal -->
  <router-view />

  <!-- Footer siempre visible o condicional si lo deseas -->
  <footer-component />
</template>

<style scoped>
/* Puedes agregar estilos adicionales aquí si necesitas personalizar cómo se muestra el footer */
</style>