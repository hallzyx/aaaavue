<template>
  <div class="p-4">
    <div class="flex justify-content-between align-items-center mb-4">
      <div class="hotel-title text-xl font-bold">
        Hotel Cheraton - IoT Devices
      </div>
      <Button label="Add Device" icon="pi pi-plus" class="p-button-sm" @click="openAddDeviceDialog" />
    </div>

    <div class="grid">
      <!-- Tarjeta por habitación -->
      <div v-for="room in rooms" :key="room.id" class="col-12 md:col-6 lg:col-4 mb-4">
        <div class="card p-3 border-round shadow-2 h-full">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="m-0">Room #{{ room.number }} - {{ room.type }}</h3>
            <Tag :value="room.status" :severity="getRoomStatusSeverity(room.status)" />
          </div>

          <Divider />

          <h4 class="mb-3">Devices</h4>

          <!-- Lista de dispositivos -->
          <div v-if="getRoomDevices(room.id).length > 0" class="device-list">
            <div
                v-for="device in getRoomDevices(room.id)"
                :key="device.id"
                class="flex justify-content-between align-items-center mb-2 p-2 border-round device-item"
            >
              <div class="flex align-items-center gap-2">
                <i :class="getDeviceIcon(device.type)" class="text-primary"></i>
                <span>{{ device.name }}</span>
              </div>
              <div class="flex gap-2 align-items-center">
                <Tag :value="device.status" :severity="getDeviceStatusSeverity(device.status)" />
                <Button
                    icon="pi pi-cog"
                    class="p-button-sm p-button-text"
                    @click="openDeviceSettings(device)"
                />
              </div>
            </div>
          </div>

          <div v-else class="text-center py-3 text-color-secondary">
            No devices assigned
          </div>
        </div>
      </div>
    </div>

    <!-- Diálogo para añadir dispositivo -->
    <Dialog v-model:visible="addDeviceDialog" header="Add Device" :style="{ width: '450px' }">
      <div class="p-fluid">
        <div class="field mb-3">
          <label>Room</label>
          <Dropdown
              v-model="newDevice.roomId"
              :options="rooms"
              optionLabel="number"
              optionValue="id"
              placeholder="Select room"
          />
        </div>
        <div class="field mb-3">
          <label>Device type</label>
          <Dropdown
              v-model="newDevice.type"
              :options="deviceTypes"
              placeholder="Select type"
          />
        </div>
        <div class="field mb-3">
          <label>Name</label>
          <InputText v-model="newDevice.name" placeholder="Device name" />
        </div>
        <div class="field mb-3">
          <label>Initial status</label>
          <Dropdown
              v-model="newDevice.status"
              :options="deviceStatusOptions"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" class="p-button-text" @click="closeAddDeviceDialog" />
        <Button label="Save" @click="saveNewDevice" />
      </template>
    </Dialog>

    <!-- Diálogo de configuración de dispositivo -->
    <Dialog v-model:visible="deviceSettingsDialog" header="Settings" :style="{ width: '500px' }">
      <div v-if="selectedDevice" class="p-fluid">
        <div class="field mb-3">
          <label>Device</label>
          <InputText v-model="selectedDevice.name" readonly />
        </div>

        <div class="field mb-3">
          <label>Status</label>
          <Dropdown
              v-model="selectedDevice.status"
              :options="deviceStatusOptions"
              class="w-full"
          />
        </div>

        <div class="field mb-3">
          <label>Properties</label>
          <div v-for="(value, key) in selectedDevice.properties" :key="key" class="mb-2">
            <label class="block text-sm mb-1">{{ key }}</label>
            <InputText v-model="selectedDevice.properties[key]" class="w-full" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Close" class="p-button-text" @click="deviceSettingsDialog = false" />
        <Button label="Save Changes" @click="handleUpdateDevice" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getDevices,
  createDevice,
  updateDevice as apiUpdateDevice,
  deleteDevice as apiDeleteDevice
} from '../services/iot-devices.service.js'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import axios from 'axios'

// Datos reactivos
const devices = ref([])
const rooms = ref([])
const newDevice = ref({
  roomId: null,
  type: null,
  name: '',
  status: 'working',
  properties: {}
})
const selectedDevice = ref(null)

// UI states
const addDeviceDialog = ref(false)
const deviceSettingsDialog = ref(false)

// Opciones
const deviceTypes = ['sensor', 'actuator']
const deviceStatusOptions = ['working', 'maintenance', 'inactive']

// Cargar datos iniciales
onMounted(async () => {
  try {
    const [roomsResponse, devicesResponse] = await Promise.all([
      axios.get('https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/rooms'),
      getDevices()
    ])

    // Asegúrate de que los IDs sean del mismo tipo (string o number)
    rooms.value = roomsResponse.data.map(r => ({ ...r }))
    devices.value = devicesResponse.map(d => ({ ...d }))

    console.log('Rooms:', rooms.value)
    console.log('Devices:', devices.value)
  } catch (error) {
    console.error('Error loading data:', error.message)
  }
})

// Métodos auxiliares
const getRoomDevices = (roomId) => {
  return devices.value.filter(device => String(device.roomId) === String(roomId))
}

const getDeviceIcon = (type) => {
  return type === 'sensor' ? 'pi pi-eye' : 'pi pi-bolt'
}

const getRoomStatusSeverity = (status) => {
  const map = {
    operational: 'success',
    maintenance: 'warning',
    inactive: 'danger'
  }
  return map[status] || 'info'
}

const getDeviceStatusSeverity = (status) => {
  const map = {
    working: 'success',
    maintenance: 'warning',
    inactive: 'danger'
  }
  return map[status] || 'info'
}

// Acciones
const openAddDeviceDialog = () => {
  newDevice.value = {
    roomId: null,
    type: null,
    name: '',
    status: 'working',
    properties: {}
  }
  addDeviceDialog.value = true
}

const closeAddDeviceDialog = () => {
  addDeviceDialog.value = false
}

const saveNewDevice = async () => {
  try {
    const created = await createDevice(newDevice.value)
    devices.value.push(created)
    addDeviceDialog.value = false
  } catch (error) {
    console.error('Error creating device:', error)
  }
}

const openDeviceSettings = (device) => {
  selectedDevice.value = { ...device }
  deviceSettingsDialog.value = true
}

const handleUpdateDevice = async () => {
  try {
    const updated = await apiUpdateDevice(selectedDevice.value.id, selectedDevice.value)
    const index = devices.value.findIndex(d => d.id === updated.id)
    if (index !== -1) {
      devices.value[index] = updated
    }
    deviceSettingsDialog.value = false
  } catch (error) {
    console.error('Error updating device:', error)
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.device-list {
  max-height: 300px;
  overflow-y: auto;
}

.device-item {
  background-color: rgba(0, 0, 0, 0.02);
  transition: background-color 0.2s;
}

.device-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.card h3 {
  color: #333333;
}

.hotel-title {
  color: #1a237e; /* Azul oscuro elegante */
  letter-spacing: 1px;
}

.card h4 {
  color: #555555;
}

.device-item span {
  color: #333333;
}

.text-color-secondary {
  color: #666666 !important;
}
</style>