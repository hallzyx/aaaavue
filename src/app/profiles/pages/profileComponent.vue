<template>
  <div class="p-4" v-if="admin">
    <!-- Título -->
    <div class="hotel-title text-xl font-bold mb-4">
      {{ admin.hotelName }} - Perfil del Administrador
    </div>

    <!-- Información personal -->
    <Card class="mb-5">
      <template #title>Datos Personales</template>
      <template #content>
        <ul class="list-none p-0 m-0">
          <li class="flex align-items-center mb-3">
            <i class="pi pi-user text-xl mr-3 text-primary"></i>
            <span><strong>Nombre:</strong> {{ admin.fullName }}</span>
          </li>
          <li class="flex align-items-center mb-3">
            <i class="pi pi-envelope text-xl mr-3 text-primary"></i>
            <span><strong>Email:</strong> {{ admin.email }}</span>
          </li>
          <li class="flex align-items-center mb-3">
            <i class="pi pi-phone text-xl mr-3 text-primary"></i>
            <span><strong>Teléfono:</strong> {{ admin.phone }}</span>
          </li>
          <li class="flex align-items-center">
            <i class="pi pi-briefcase text-xl mr-3 text-primary"></i>
            <span><strong>Departamento:</strong> {{ admin.department }}</span>
          </li>
        </ul>
      </template>
    </Card>

    <!-- Información del hotel -->
    <Card>
      <template #title>{{ admin.hotelName }}</template>
      <template #subtitle>{{ admin.hotelAddress }}</template>
      <template #content>
        <ul class="list-none p-0 m-0">
          <li class="flex align-items-center mb-3">
            <i :class="getHotelStatusIcon(admin.hotelStatus)" class="text-xl mr-3" :style="{ color: getHotelStatusColor(admin.hotelStatus) }"></i>
            <span><strong>Estado del hotel:</strong> {{ formatHotelStatus(admin.hotelStatus) }}</span>
          </li>
          <li class="flex align-items-center mb-3">
            <i class="pi pi-home text-xl mr-3 text-info"></i>
            <span><strong>Habitaciones totales:</strong> {{ admin.totalRooms }}</span>
          </li>
          <li class="flex align-items-center mb-3">
            <i class="pi pi-lock-open text-xl mr-3 text-danger"></i>
            <span><strong>Ocupadas:</strong> {{ admin.occupiedRooms }}</span>
          </li>
          <li class="flex align-items-center mb-3">
            <i class="pi pi-refresh text-xl mr-3 text-warning"></i>
            <span><strong>En limpieza:</strong> {{ admin.cleaningRooms }}</span>
          </li>
          <li class="flex align-items-center">
            <i class="pi pi-wrench text-xl mr-3 text-secondary"></i>
            <span><strong>Mantenimiento:</strong> {{ admin.maintenanceRooms }}</span>
          </li>
        </ul>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'

const admin = ref({
  id: 3,
  firstName: 'Juan',
  lastName: 'Perez',
  email: 'juan.perez@hotel.com',
  phone: '+34600111222',
  department: 'Management',
  hotelName: 'Hotel Cheraton Center',
  hotelAddress: 'Calle Gran Vía 123, Lima',
  hotelStatus: 'active',
  totalRooms: 6,
  occupiedRooms: 2,
  availableRooms: 3,
  cleaningRooms: 1,
  maintenanceRooms: 1
})

// Métodos auxiliares
const formatHotelStatus = (status) => {
  const statuses = {
    active: 'Activo',
    inactive: 'Inactivo',
    maintenance: 'Mantenimiento',
    pending: 'Pendiente'
  }
  return statuses[status] || status
}

const getHotelStatusIcon = (status) => {
  const icons = {
    active: 'pi-check-circle',
    inactive: 'pi-times-circle',
    maintenance: 'pi-exclamation-triangle',
    pending: 'pi-clock'
  }
  return icons[status] || 'pi-question'
}

const getHotelStatusColor = (status) => {
  const colors = {
    active: '#4caf50',
    inactive: '#f44336',
    maintenance: '#ff9800',
    pending: '#2196f3'
  }
  return colors[status] || '#9e9e9e'
}
</script>

<style scoped>
.hotel-title {
  color: #1a237e;
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}
.text-success {
  color: #4caf50;
}
.text-info {
  color: #2196f3;
}
.text-danger {
  color: #f44336;
}
.text-warning {
  color: #ff9800;
}
.text-secondary {
  color: #9e9e9e;
}
</style>