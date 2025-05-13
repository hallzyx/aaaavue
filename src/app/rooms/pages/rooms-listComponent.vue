<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-3">

      <h2 class="m-0" style="color: black">Rooms Management</h2>


      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - Cuartos
      </div>

      <Button label="Add Room" icon="pi pi-plus" @click="openNewRoomForm" />
    </div>

    <DataTable :value="rooms" class="p-datatable-sm" dataKey="id">
      <Column field="number" header="Room #" />
      <Column field="type" header="Type" />
      <Column field="status" header="Status" />
      <Column field="price" header="Price" />
      <Column field="floor" header="Floor" />
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-sm p-button-text" @click="editRoom(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-sm p-button-text text-red-500" @click="deleteRoomById(slotProps.data.id)" />
        </template>
      </Column>
    </DataTable>
    <!-- Dialog -->
    <Dialog v-model:visible="roomDialog" modal header="Room Form" :style="{ width: '400px' }">
      <form @submit.prevent="saveRoom">
        <div class="p-fluid">
          <div class="field mb-3">
            <label>Room Number</label>
            <InputText v-model="roomForm.number" required />
          </div>
          <div class="field mb-3">
            <label>Type</label>
            <InputText v-model="roomForm.type" required />
          </div>
          <div class="field mb-3">
            <label>Status</label>
            <Dropdown v-model="roomForm.status" :options="statusOptions" placeholder="Select status" />
          </div>
          <div class="field mb-3">
            <label>Price</label>
            <InputNumber v-model="roomForm.price" mode="currency" currency="USD" locale="en-US" />
          </div>
          <div class="field mb-3">
            <label>Floor</label>
            <InputNumber v-model="roomForm.floor" />
          </div>
        </div>

        <div class="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" class="p-button-text" @click="roomDialog = false" />
          <Button label="Save" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRooms, deleteRoom, createRoom, updateRoom } from '../services/roomsServices.js'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

const rooms = ref([])
const roomDialog = ref(false)
const editingId = ref(null)

const roomForm = reactive({
  number: '',
  type: '',
  status: '',
  price: 0,
  floor: 1,
  description: '' // opcional
})

const statusOptions = ['Available', 'Occupied', 'Cleaning', 'Maintenance']

const fetchRooms = async () => {
  rooms.value = await getRooms()
}

const deleteRoomById = async (id) => {
  try {
    await deleteRoom(id)
    rooms.value = rooms.value.filter(r => r.id !== id)
  } catch (error) {
    console.error('Error deleting room:', error.message)
  }
}

const editRoom = (room) => {
  Object.assign(roomForm, room)
  editingId.value = room.id
  roomDialog.value = true
}

const openNewRoomForm = () => {
  Object.assign(roomForm, { number: '', type: '', status: '', price: 0, floor: 1, description: '' })
  editingId.value = null
  roomDialog.value = true
}

const saveRoom = async () => {
  try {
    if (editingId.value) {
      const updated = await updateRoom(editingId.value, { ...roomForm })
      const index = rooms.value.findIndex(r => r.id === editingId.value)
      rooms.value[index] = updated
    } else {
      const created = await createRoom({ ...roomForm })
      rooms.value.push(created)
    }
    roomDialog.value = false
  } catch (error) {
    console.error('Error saving room:', error.message)
  }
}

onMounted(fetchRooms)
</script>

<style scoped>
.hotel-title {
  color: #1a237e; /* Azul oscuro elegante */
  letter-spacing: 1px;
}
.text-primary {
  color: #2196f3;
}
</style>