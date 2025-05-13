import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura' // Tema moderno de PrimeVue 3

// Componentes PrimeVue (solo los que usas)
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Drawer from 'primevue/drawer'
import FileUpload from 'primevue/fileupload'
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield' // ✅ Importación corregida
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Menu from 'primevue/menu'
import Rating from 'primevue/rating'
import Row from 'primevue/row'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import Toolbar from 'primevue/toolbar'

// Estilos globales
import 'primeicons/primeicons.css'      // Iconos
import 'primeflex/primeflex.css'        // Layout utilities

// i18n y router
import i18n from "./i18n.js"
import router from "./app/router/index.js"

// Crear aplicación
const app = createApp(App)

// Registrar componentes globalmente
app.component('Chart', Chart)

// Usar plugins
app.use(i18n)
    .use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            ripple: true,
            options: {
                darkModeSelector: false
            }
        }
    })

// Registrar componentes globalmente (según uso)
app
    .component('pv-button', Button)
    .component('pv-card', Card)
    .component('pv-checkbox', Checkbox)
    .component('pv-column', Column)
    .component('pv-confirm-dialog', ConfirmDialog)
    .component('pv-data-table', DataTable)
    .component('pv-dialog', Dialog)
    .component('pv-drawer', Drawer)
    .component('pv-file-upload', FileUpload)
    .component('pv-float-label', FloatLabel)
    .component('pv-icon-field', IconField) // ✅ Registrado correctamente
    .component('pv-input-icon', InputIcon)
    .component('pv-input-text', InputText)
    .component('pv-input-number', InputNumber)
    .component('pv-menu', Menu)
    .component('pv-rating', Rating)
    .component('pv-row', Row)
    .component('pv-select', Select)
    .component('pv-select-button', SelectButton)
    .component('pv-tag', Tag)
    .component('pv-textarea', Textarea)
    .component('pv-toolbar', Toolbar)
    .component('pv-toast', Toast)

// Montar aplicación
app.mount('#app')