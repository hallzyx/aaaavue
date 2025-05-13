// src/services/staff.service.js
import axios from 'axios'
import StaffMember from '../model/staff-list.entity.js'

const API_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/users'
const REQUESTS_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1/serviceRequests'

/**
 * Obtiene todo el personal y une con las peticiones asignadas
 */
export const getStaffWithRequests = async () => {
    const [usersRes, requestsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(REQUESTS_URL)
    ])

    const users = usersRes.data.filter(u => u.role === 'staff')
    const requests = requestsRes.data

    return users.map(user => {
        const userRequests = requests.filter(req => req.assignedTo === user.id && req.status !== 'completed')

        // Usamos la clase StaffMember como modelo
        return new StaffMember({
            ...user,
            currentRequests: userRequests
        })
    })
}