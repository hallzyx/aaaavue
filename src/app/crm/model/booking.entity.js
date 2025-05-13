// src/model/booking.entity.js
export default class Booking {
    constructor({
                    id,
                    userId,
                    hotelId,
                    roomId,
                    checkInDate,
                    checkOutDate,
                    status,
                    totalPrice,
                    paymentStatus,
                    specialRequests,
                    createdAt,
                    preferences = {},
                    appliedDevicePreferences = []
                }) {
        this.id = id;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.checkInDate = new Date(checkInDate);
        this.checkOutDate = new Date(checkOutDate);
        this.status = status;
        this.totalPrice = totalPrice;
        this.paymentStatus = paymentStatus;
        this.specialRequests = specialRequests;
        this.createdAt = new Date(createdAt);
        this.preferences = preferences;
        this.appliedDevicePreferences = appliedDevicePreferences;

        // Estos campos vienen del servicio, no de aquí
        this.user = null;
        this.room = null;
    }

    get guestName() {
        return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'Desconocido';
    }

    get roomNumber() {
        return this.room?.number || 'N/A';
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            hotelId: this.hotelId,
            roomId: this.roomId,
            checkInDate: this.checkInDate.toISOString(),
            checkOutDate: this.checkOutDate.toISOString(),
            status: this.status,
            totalPrice: this.totalPrice,
            paymentStatus: this.paymentStatus,
            specialRequests: this.specialRequests,
            createdAt: this.createdAt.toISOString(),
            preferences: this.preferences,
            appliedDevicePreferences: this.appliedDevicePreferences
        };
    }
}