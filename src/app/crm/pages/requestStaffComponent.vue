<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - Personal del Hotel
      </div>
    </div>
    <DataTable :value="staffList" paginator :rows="10" class="p-datatable-sm">
      <!-- Nombre -->
      <Column field="fullName" header="Nombre">
        <template #body="{ data }">
          <i class="pi pi-user text-blue-500 mr-2"></i>
          {{ data.fullName }}
        </template>
      </Column>

      <!-- Departamento -->
      <Column field="department" header="Departamento"></Column>

      <!-- Teléfono -->
      <Column field="phone" header="Teléfono"></Column>

      <!-- Estado -->
      <Column field="available" header="Estado">
        <template #body="{ data }">
          <Tag :value="data.available" :severity="getAvailabilitySeverity(data)" />
        </template>
      </Column>

      <!-- Cantidad de tareas -->
      <Column field="currentRequests" header="Peticiones Activas">
        <template #body="{ data }">
          <Badge :value="data.currentRequests.length" severity="danger" v-if="data.currentRequests.length > 0" />
          <span v-else>Ninguna</span>
        </template>
      </Column>

      <!-- Acciones -->
      <Column header="Acciones">
        <template #body="{ data }">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-secondary" title="Ver detalles" />
          <Button icon="pi pi-briefcase" class="p-button-rounded p-button-text p-button-success" title="Asignar tarea" @click="assignTask(data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import { getStaffWithRequests } from '../services/staff-list.service.js'

const staffList = ref([])

onMounted(async () => {
  try {
    staffList.value = await getStaffWithRequests()
  } catch (error) {
    console.error('Error al cargar personal:', error)
  }
})

const getAvailabilitySeverity = (member) => {
  return member.isAvailable ? 'success' : 'warning'
}

const assignTask = (member) => {
  // Aquí puedes abrir un diálogo para asignar una nueva petición
  alert(`Asignar tarea a: ${member.fullName}`)
}
</script>

<style scoped>
.p-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.p-column-title {
  font-weight: bold;
}

.hotel-title {
  color: #1a237e; /* Azul oscuro elegante */
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}

</style>