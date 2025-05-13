<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-3">
      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - Reservas
      </div>
      <Button label="Nueva Reserva" icon="pi pi-plus" @click="openNewBookingForm" />
    </div>

    <DataTable :value="bookings" paginator :rows="10" class="p-datatable-sm">
      <!-- Huésped -->
      <Column field="fullName" header="Huésped">
        <template #body="{ data }">
          <i class="pi pi-user text-blue-500 mr-2"></i>
          {{ data.fullName }}
        </template>
      </Column>

      <!-- Habitación -->
      <Column field="roomNumber" header="Habitación">
        <template #body="{ data }">
          <i class="pi pi-building text-purple-500 mr-2"></i>
          {{ data.roomNumber }}
        </template>
      </Column>

      <!-- Check-In -->
      <Column field="checkInDate" header="Check-In">
        <template #body="{ data }">
          <i class="pi pi-calendar-plus text-green-500 mr-2"></i>
          {{ formatDate(data.checkInDate) }}
        </template>
      </Column>

      <!-- Check-Out -->
      <Column field="checkOutDate" header="Check-Out">
        <template #body="{ data }">
          <i class="pi pi-calendar-minus text-red-500 mr-2"></i>
          {{ formatDate(data.checkOutDate) }}
        </template>
      </Column>

      <!-- Acciones -->
      <Column header="Acciones">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-success" @click="openEditBookingForm(data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="deleteBooking(data.id)" />
        </template>
      </Column>
    </DataTable>

    <!-- Diálogo para crear/editar reserva -->
    <Dialog v-model:visible="bookingDialog" modal :header="editingBooking ? 'Editar Reserva' : 'Nueva Reserva'" :style="{ width: '500px' }">
      <form @submit.prevent="saveBooking">
        <div class="p-fluid">
          <!-- Huésped -->
          <div class="field mb-3">
            <label>Huésped</label>
            <Dropdown v-model="currentBooking.userId" :options="guests" optionLabel="fullName" optionValue="id" placeholder="Seleccione Huésped" class="w-full" />
          </div>

          <!-- Habitación -->
          <div class="field mb-3">
            <label>Habitación</label>
            <Dropdown v-model="currentBooking.roomId" :options="rooms" optionLabel="number" optionValue="id" placeholder="Seleccione Habitación" class="w-full" />
          </div>

          <!-- Check-In -->
          <div class="field mb-3">
            <label>Check-In</label>
            <Calendar v-model="currentBooking.checkInDate" showTime hourFormat="24" class="w-full" />
          </div>

          <!-- Check-Out -->
          <div class="field mb-3">
            <label>Check-Out</label>
            <Calendar v-model="currentBooking.checkOutDate" showTime hourFormat="24" class="w-full" />
          </div>

          <!-- Petición Especial -->
          <div class="field mb-3">
            <label>Peticiones Especiales</label>
            <Textarea v-model="currentBooking.specialRequests" rows="3" class="w-full" />
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-content-end gap-2 mt-4">
          <Button label="Cancelar" class="p-button-text" @click="bookingDialog = false" />
          <Button label="Guardar" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'

// Importamos el servicio
import { getBookingsWithDetails } from '../services/booking.service.js'

// Datos reactivos
const bookings = ref([])
const guests = ref([])
const rooms = ref([])

// UI State
const bookingDialog = ref(false)
const editingBooking = ref(null)
const currentBooking = ref({
  id: null,
  userId: null,
  roomId: null,
  checkInDate: null,
  checkOutDate: null,
  specialRequests: '',
  status: 'active'
})

// Cargar datos iniciales
onMounted(async () => {
  try {
    // Cargamos las reservas con detalles de huésped y habitación
    bookings.value = await getBookingsWithDetails()

    // Cargamos solo los huéspedes (role: "guest")
    const usersResponse = await fetch('https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/users').then(res => res.json())
    guests.value = usersResponse.filter(u => u.role === 'guest')

    // Cargamos todas las habitaciones
    const roomsResponse = await fetch('https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/rooms').then(res => res.json())
    rooms.value = roomsResponse
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
})

// Métodos

const openNewBookingForm = () => {
  currentBooking.value = {
    id: null,
    userId: null,
    roomId: null,
    checkInDate: null,
    checkOutDate: null,
    specialRequests: '',
    status: 'active'
  }
  editingBooking.value = null
  bookingDialog.value = true
}

const openEditBookingForm = (booking) => {
  currentBooking.value = {
    id: booking.id,
    userId: booking.userId,
    roomId: booking.roomId,
    checkInDate: new Date(booking.checkInDate),
    checkOutDate: new Date(booking.checkOutDate),
    specialRequests: booking.specialRequests
  }
  editingBooking.value = booking.id
  bookingDialog.value = true
}

const saveBooking = async () => {
  if (editingBooking.value) {
    // Actualizar
    const index = bookings.value.findIndex(b => b.id === editingBooking.value)
    if (index !== -1) {
      bookings.value[index] = { ...bookings.value[index], ...currentBooking.value }
    }
  } else {
    // Crear
    const newId = Math.max(...bookings.value.map(b => b.id), 0) + 1
    bookings.value.push({ ...currentBooking.value, id: newId })
  }
  bookingDialog.value = false
}

const deleteBooking = (id) => {
  bookings.value = bookings.value.filter(b => b.id !== id)
}

// Formato de fecha
const formatDate = (date) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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