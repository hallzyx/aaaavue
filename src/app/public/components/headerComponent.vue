<script>
import {SelectButton as PvSelectButton, Toolbar as PvToolbar} from "primevue";
import LanguageSwitcher from "./languageSwitcher.component.vue";

export default {
  name: "headerBar",
  components: {LanguageSwitcher, PvSelectButton, PvToolbar},
  emits: ['update:visible'],
  props: {
    visible: {
      type: Boolean,
      required: true,
    }
  },
  methods:{
    toggleMenu() {
      this.$emit('update:visible', true);
    }
  }
}
</script>

<template>
  <pv-toolbar style="background: var(--color-secondary); color: var(--color-primary-light);">
    <template #start>
      <div class="flex gap-3 justify-content-center align-items-center">
        <button class="border-none bg-transparent cursor-pointer" @click="toggleMenu">
          <i class="pi pi-bars" />
        </button>
        <span class="font-semibold text-2xl">Custom Host</span>
      </div>
    </template>
    <template #end>
      <div class="flex align-items-center gap-3">
        <div class="user-info flex align-items-center gap-2">
          <i class="pi pi-user"></i>
          <span>Juan Pérez</span>
        </div>
        <language-switcher />
      </div>
    </template>
  </pv-toolbar>
</template>

<style scoped>
span {
  font-family: "Anta", sans-serif;
  letter-spacing: max(1px, 0.1vw);
}
button {
  color: var(--color-primary-light);
}
.user-info {
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.pi-user {
  font-size: 1.2rem;
}
</style>