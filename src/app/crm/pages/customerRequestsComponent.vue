<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-3">
      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - Peticiones del Huésped
      </div>
      <Button label="Nueva Petición" icon="pi pi-plus" @click="openNewRequestForm" />
    </div>
    <div class="grid">
      <!-- Sección de Habitaciones -->
      <div class="col-12 md:col-4">
        <Card class="h-full">
          <template #title>Habitaciones</template>
          <template #content>
            <DataTable
                :value="rooms"
                selectionMode="single"
                v-model:selection="selectedRoom"
                dataKey="id"
                class="p-datatable-sm"
            >
              <Column field="number" header="Número"></Column>
              <Column field="type" header="Tipo"></Column>
              <Column field="status" header="Estado">
                <template #body="{data}">
                  <Tag :value="data.status" :severity="getRoomStatusSeverity(data.status)" />
                </template>
              </Column>
              <Column header="Peticiones">
                <template #body="{data}">
                  <Badge :value="getRoomRequests(data.id).length" severity="danger" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <!-- Sección de Peticiones -->
      <div class="col-12 md:col-8">
        <Card>
          <template #title>Peticiones Pendientes</template>
          <template #subtitle v-if="selectedRoom">
            Habitación #{{ selectedRoom.number }} - {{ selectedRoom.type }}
          </template>
          <template #content>
            <DataTable
                :value="filteredRequests"
                class="p-datatable-sm"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            >
              <Column field="createdAt" header="Fecha">
                <template #body="{data}">
                  {{ formatDate(data.createdAt) }}
                </template>
              </Column>
              <Column field="type" header="Tipo"></Column>
              <Column field="description" header="Descripción"></Column>
              <Column field="status" header="Estado">
                <template #body="{data}">
                  <Tag :value="data.status" :severity="getRequestStatusSeverity(data.status)" />
                </template>
              </Column>
              <Column field="assignedTo" header="Asignado a">
                <template #body="{data}">
                  <Dropdown
                      v-model="data.assignedTo"
                      :options="staffMembers"
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Asignar"
                      @change="assignStaff(data.id, data.assignedTo)"
                      class="w-full"
                  />
                </template>
              </Column>
              <Column header="Acciones">
                <template #body="{data}">
                  <Button
                      icon="pi pi-check"
                      class="p-button-sm p-button-text mr-2"
                      @click="resolveRequest(data.id)"
                      v-if="data.status !== 'Resuelto'"
                  />
                  <Button
                      icon="pi pi-trash"
                      class="p-button-sm p-button-text text-red-500"
                      @click="deleteRequestById(data.id)"
                  />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Diálogo para nueva petición -->
    <Dialog v-model:visible="requestDialog" modal header="Nueva Petición" :style="{width: '500px'}">
      <form @submit.prevent="saveRequest">
        <div class="p-fluid">
          <div class="field mb-3">
            <label>Habitación</label>
            <Dropdown
                v-model="requestForm.roomId"
                :options="rooms"
                optionLabel="number"
                optionValue="id"
                placeholder="Seleccione habitación"
                class="w-full"
            />
          </div>
          <div class="field mb-3">
            <label>Tipo de petición</label>
            <Dropdown
                v-model="requestForm.type"
                :options="requestTypes"
                placeholder="Seleccione tipo"
                class="w-full"
            />
          </div>
          <div class="field mb-3">
            <label>Descripción</label>
            <Textarea
                v-model="requestForm.description"
                rows="3"
                placeholder="Detalles de la petición..."
                class="w-full"
            />
          </div>
          <div class="field mb-3">
            <label>Prioridad</label>
            <Dropdown
                v-model="requestForm.priority"
                :options="priorityOptions"
                placeholder="Seleccione prioridad"
                class="w-full"
            />
          </div>
        </div>
        <div class="flex justify-content-end gap-2 mt-4">
          <Button label="Cancelar" class="p-button-text" @click="requestDialog = false" />
          <Button label="Guardar" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Textarea from 'primevue/textarea'

// Importa servicios y modelos
import {
  getCustomerRequests,
  createCustomerRequest,
  deleteCustomerRequest,
  assignStaffToRequest,
  resolveCustomerRequest
} from '../services/customer-request.service.js'

import CustomerRequest from '../model/customer-request.entity.js'

// Reactive data
const rooms = ref([])
const staffMembers = ref([
  { id: 4, name: 'Ana López', role: 'Housekeeping' },
  { id: 5, name: 'David Martínez', role: 'Technical Support' }
])
const requests = ref([])
const requestTypes = ref(['Toallas/Ropa', 'Limpieza', 'Reparación', 'Room Service', 'Otros'])
const priorityOptions = ref(['Baja', 'Media', 'Alta', 'Urgente'])

// UI State
const selectedRoom = ref(null)
const requestDialog = ref(false)

// Formulario
const requestForm = ref({
  roomId: null,
  type: null,
  description: '',
  priority: 'Media',
})

// Computed
const filteredRequests = computed(() => {
  if (!selectedRoom.value) return []
  return requests.value
      .filter(r => r.roomId === selectedRoom.value.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Métodos UI
const getRoomStatusSeverity = (status) => {
  const statusMap = {
    available: 'success',
    occupied: 'warning',
    cleaning: 'info',
    maintenance: 'danger'
  }
  return statusMap[status] || 'info'
}

const getRequestStatusSeverity = (status) => {
  const statusMap = {
    pending: 'warning',
    'in-progress': 'info',
    completed: 'success'
  }
  return statusMap[status] || 'info'
}

const getRoomRequests = (roomId) => {
  return requests.value.filter(r => r.roomId === roomId && r.status !== 'completed')
}

const formatDate = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' - ' +
      new Date(date).toLocaleDateString()
}

// Acciones
const openNewRequestForm = () => {
  requestForm.value = {
    roomId: selectedRoom.value?.id || null,
    type: null,
    description: '',
    priority: 'Media'
  }
  requestDialog.value = true
}

const saveRequest = async () => {
  const payload = {
    ...requestForm.value,
    userId: 1,
    hotelId: 1,
    status: 'pending'
  }

  const newRequest = await createCustomerRequest(payload)
  requests.value.push(newRequest)
  requestDialog.value = false
}

const deleteRequestById = async (id) => {
  await deleteCustomerRequest(id)
  requests.value = requests.value.filter(r => r.id !== id)
}

const resolveRequest = async (id) => {
  const resolved = await resolveCustomerRequest(id)
  const idx = requests.value.findIndex(r => r.id === id)
  if (idx > -1) requests.value[idx] = resolved
}

const assignStaff = async (requestId, staffId) => {
  const updated = await assignStaffToRequest(requestId, staffId)
  const idx = requests.value.findIndex(r => r.id === requestId)
  if (idx > -1) requests.value[idx] = updated
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    // Obtener todas las peticiones
    const allRequests = await getCustomerRequests()
    requests.value = allRequests

    // Obtener todas las habitaciones
    const response = await fetch('https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/rooms') // Ajusta según tu API
    const roomData = await response.json()
    rooms.value = roomData
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})
</script>

<style scoped>
.p-card {
  height: 100%;
}
.p-datatable {
  font-size: 0.9rem;
}
.p-dropdown {
  width: 100%;
}

.hotel-title {
  color: #1a237e; /* Azul oscuro elegante */
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}

</style>