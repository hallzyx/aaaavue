// src/models/StaffMember.js

export default class StaffMember {
    constructor({
                    id,
                    hotelId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    department,
                    role,
                    status = 'active',
                    currentRequests = [],
                }) {
        this.id = id;
        this.hotelId = hotelId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.role = role;
        this.status = status;
        this.currentRequests = currentRequests;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    get isAvailable() {
        return this.currentRequests.length === 0;
    }

    get requestCount() {
        return this.currentRequests.length;
    }

    get availabilityStatus() {
        return this.isAvailable ? 'Disponible' : 'Ocupado';
    }

    toJSON() {
        return {
            id: this.id,
            hotelId: this.hotelId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            department: this.department,
            role: this.role,
            status: this.status,
            currentRequests: this.currentRequests
        };
    }
}