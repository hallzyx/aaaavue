import axios from 'axios'
import Rooms from '../../rooms/model/rooms.entity.js'

const API_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/rooms'

export const getRooms = async () => {
    const response = await axios.get(API_URL)
    return response.data.map(room => new Rooms(room))
}

export const createRoom = async (roomData) => {
    const room = new Rooms(roomData)
    const response = await axios.post(API_URL, room)
    return new Rooms(response.data)
}

export const updateRoom = async (id, roomData) => {
    const response = await axios.put($`{API_URL}/${id}`, roomData)
    return new Rooms(response.data)
}

export const deleteRoom = async (id) => {
    await axios.delete($`{API_URL}/${id}`)
}