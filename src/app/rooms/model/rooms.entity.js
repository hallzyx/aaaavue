export default class Room {
    constructor({
                    id,
                    hotelId,
                    number,
                    type,
                    status,
                    price,
                    floor,
                    description,
                    currentGuestId,
                    activeRequests,
                }) {
        this.id = id;
        this.hotelId = hotelId;
        this.number = number;
        this.type = type;
        this.status = status;
        this.price = price;
        this.floor = floor;
        this.description = description;
        this.currentGuestId = currentGuestId;
        this.activeRequests = activeRequests || [];
    }
}