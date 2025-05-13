import axios from 'axios'
import IotDevice from '../model/iot-devices.entity.js'

const API_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/iotDevices'
const ROOMS_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/rooms'

// Obtener todos los dispositivos
export const getDevices = async () => {
    try {
        const response = await axios.get(API_URL)
        console.log('Datos recibidos desde API:', response.data)
        return response.data.map(d => new IotDevice(d))
    } catch (error) {
        console.error(
            'Error fetching devices:',
            error.message,
            error.response?.data || ''
        )
        return []
    }
}

// Obtener dispositivo por ID
export const getDeviceById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        console.log(`Dispositivo ${id} obtenido:`, response.data)
        return new IotDevice(response.data)
    } catch (error) {
        console.error(
            `Error fetching device ${id}:`,
            error.message,
            error.response?.data || ''
        )
        return null
    }
}

// Obtener dispositivos por habitación
export const getDevicesByRoom = async (roomId) => {
    try {
        const response = await axios.get(`${API_URL}?roomId=${roomId}`)
        console.log(`Dispositivos para room ${roomId}:`, response.data)
        return response.data.map(d => new IotDevice(d))
    } catch (error) {
        console.error(
            `Error fetching devices for room ${roomId}:`,
            error.message,
            error.response?.data || ''
        )
        return []
    }
}

// Crear dispositivo
export const createDevice = async (deviceData) => {
    try {
        // Configuración por defecto basada en el tipo
        const defaultProperties = {
            sensor: { value: '0', unit: '' },
            actuator: { state: 'off', intensity: '0%' }
        }

        const deviceToCreate = {
            ...deviceData,
            properties: deviceData.properties || defaultProperties[deviceData.type] || {},
            customizable: deviceData.customizable !== false
        }

        const response = await axios.post(API_URL, deviceToCreate)

        // Actualizar lista de dispositivos en la habitación
        const roomResponse = await axios.get(`${ROOMS_URL}/${deviceData.roomId}`)
        const room = roomResponse.data

        await axios.patch(`${ROOMS_URL}/${deviceData.roomId}`, {
            iotDevices: [...room.iotDevices, response.data.id]
        })

        console.log('Dispositivo creado:', response.data)
        return new IotDevice(response.data)

    } catch (error) {
        console.error(
            'Error creating device:',
            error.message,
            error.response?.data || ''
        )
        throw error
    }
}

// Actualizar dispositivo
export const updateDevice = async (id, deviceData) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, deviceData)
        console.log(`Dispositivo ${id} actualizado:`, response.data)
        return new IotDevice(response.data)
    } catch (error) {
        console.error(
            `Error updating device ${id}:`,
            error.message,
            error.response?.data || ''
        )
        throw error
    }
}

// Eliminar dispositivo
export const deleteDevice = async (id) => {
    try {
        const device = await getDeviceById(id)
        if (!device) throw new Error('Device not found')

        await axios.delete(`${API_URL}/${id}`)

        // Actualizar habitación
        const roomResponse = await axios.get(`${ROOMS_URL}/${device.roomId}`)
        const room = roomResponse.data

        await axios.patch(`${ROOMS_URL}/${device.roomId}`, {
            iotDevices: room.iotDevices.filter(deviceId => deviceId !== id)
        })

        console.log(`Dispositivo ${id} eliminado`)
        return true

    } catch (error) {
        console.error(
            `Error deleting device ${id}:`,
            error.message,
            error.response?.data || ''
        )
        throw error
    }
}

// Actualizar propiedades del dispositivo
export const updateDeviceProperties = async (id, properties) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, { properties })
        console.log(`Propiedades del dispositivo ${id} actualizadas`)
        return new IotDevice(response.data)
    } catch (error) {
        console.error(
            `Error updating device ${id} properties:`,
            error.message,
            error.response?.data || ''
        )
        throw error
    }
}