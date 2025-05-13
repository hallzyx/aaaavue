<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} Hotel Sheraton Center. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: var(--color-secondary); /* Mismo fondo que el header */
  color: var(--color-primary-light); /* Mismo color de texto que el header */
  padding: 1rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Borde sutil */
  font-size: 0.9rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer a {
  color: var(--color-primary-light);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer a:hover {
  color: #ffffff;
  text-decoration: underline;
}
</style>