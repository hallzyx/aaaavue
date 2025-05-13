<script>
import {SelectButton as PvSelectButton} from "primevue";

export default {
  name: "languageSwitcher",
  components: {PvSelectButton},
  data(){
    return{
      languages: ['en', 'es'],
      language: 'en',
    }
  }
}
</script>

<template>
  <pv-select-button v-model="$i18n.locale" :options=languages class="tl-lang uppercase"

    />
</template>

<style scoped>
.tl-lang button {
  background: var(--color-primary-light) !important;
}
</style>