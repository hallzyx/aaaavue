// src/services/home.service.js
import axios from 'axios'

const API_URL = 'https://api-chafa-git-main-hallzyxs-projects.vercel.app/api/v1'

export const getHotelDashboardStats = async () => {
    try {
        const [roomsRes, bookingsRes, serviceRequestsRes, usersRes, iotDevicesRes] = await Promise.all([
            axios.get(`${API_URL}/rooms`),
            axios.get(`${API_URL}/bookings`),
            axios.get(`${API_URL}/serviceRequests`),
            axios.get(`${API_URL}/users`),
            axios.get(`${API_URL}/iotDevices`)
        ])

        const rooms = roomsRes.data
        const bookings = bookingsRes.data
        const serviceRequests = serviceRequestsRes.data
        const users = usersRes.data
        const iotDevices = iotDevicesRes.data

        // Contar habitaciones ocupadas
        const occupiedRooms = rooms.filter(r => r.status === 'occupied').length
        const totalRooms = rooms.length

        // Reservas de hoy
        const today = new Date().toISOString().split('T')[0]
        const checkInsToday = bookings.filter(b => b.checkInDate.startsWith(today)).length

        // Huéspedes actuales
        const activeBookings = bookings.filter(b => b.status === 'active')
        const currentGuests = activeBookings.map(booking => {
            const room = rooms.find(r => r.id === booking.roomId)
            const user = users.find(u => u.id === booking.userId)
            return {
                roomNumber: room?.number || 'N/A',
                name: user ? `${user.firstName} ${user.lastName}` : 'Desconocido',
                checkIn: booking.checkInDate.split('T')[0],
                checkOut: booking.checkOutDate.split('T')[0]
            }
        })

        // Solicitudes urgentes
        const urgentRequests = serviceRequests.filter(
            req => req.priority === 'high' && req.status !== 'completed'
        ).length

        // Dispositivos IoT inactivos
        const inactiveIot = iotDevices.filter(d => d.status === 'inactive').length
        const inactiveIotList = iotDevices.filter(d => d.status === 'inactive')

        // Reservas en los últimos 30 días
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentBookings = bookings.filter(booking => {
            const date = new Date(booking.checkInDate)
            return date >= thirtyDaysAgo
        })

        const dailyBookings = {}
        for (let i = 0; i < 30; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            dailyBookings[dateStr] = 0
        }

        recentBookings.forEach(booking => {
            const dateStr = booking.checkInDate.split('T')[0]
            if (dailyBookings[dateStr] !== undefined) {
                dailyBookings[dateStr]++
            }
        })

        const labels = Object.keys(dailyBookings).sort()
        const data = labels.map(date => dailyBookings[date])

        return {
            summaryCards: [
                { titleKey: 'dashboard.summary_cards.occupied_rooms', value: `${occupiedRooms} / ${totalRooms}`, icon: 'pi pi-home' },
                { titleKey: 'dashboard.summary_cards.bookings_today', value: String(checkInsToday), icon: 'pi pi-calendar-plus' },
                { titleKey: 'dashboard.summary_cards.urgent_requests', value: String(urgentRequests), icon: 'pi pi-wrench', badge: 'Urgente' },
                { titleKey: 'dashboard.summary_cards.pending_checkouts', value: '0', icon: 'pi pi-sign-out' }
            ],
            guests: currentGuests,
            inactiveIot,
            inactiveIotList,
            bookingsHistory: {
                labels,
                data
            }
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error)
        return {
            summaryCards: [],
            guests: [],
            inactiveIot: 0,
            inactiveIotList: [],
            bookingsHistory: {
                labels: [],
                data: []
            }
        }
    }
}