// customer-request.entity.js
export default class CustomerRequest {
    constructor({
                    id,
                    userId,
                    hotelId,
                    roomId,
                    type,
                    category,
                    description,
                    status,
                    priority,
                    createdAt,
                    assignedTo = null,
                    completedAt = null,
                    history = [],
                }) {
        this.id = id;
        this.userId = userId;
        this.hotelId = hotelId;
        this.roomId = roomId;
        this.type = type;
        this.category = category;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.assignedTo = assignedTo;
        this.completedAt = completedAt;
        this.history = history;
    }

    /**
     * Asigna un miembro del staff a esta petición
     */
    assignStaff(staffId) {
        this.assignedTo = staffId;
        this.status = 'En progreso';
        this.addHistoryEntry('Asignado', `Petición asignada al personal ${staffId}`);
    }

    /**
     * Marca la solicitud como resuelta
     */
    resolve() {
        this.status = 'Resuelto';
        this.completedAt = new Date().toISOString();
        this.addHistoryEntry('Resuelto', 'La petición ha sido completada');
    }

    /**
     * Agrega una entrada al historial
     */
    addHistoryEntry(action, notes) {
        this.history.push({
            timestamp: new Date().toISOString(),
            action,
            changedBy: this.assignedTo || this.userId,
            notes
        });
    }


    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            hotelId: this.hotelId,
            roomId: this.roomId,
            type: this.type,
            category: this.category,
            description: this.description,
            status: this.status,
            priority: this.priority,
            createdAt: this.createdAt,
            assignedTo: this.assignedTo,
            completedAt: this.completedAt,
            history: this.history,
        };
    }
}