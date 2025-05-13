export default class IotDevice {
    constructor({
                    id,
                    name,
                    type,
                    roomId,
                    status = 'working',
                    properties = {},
                    customizable = true,
                    hotelId = null
                }) {
        this.id = id
        this.name = name
        this.type = type // 'sensor' o 'actuator'
        this.roomId = roomId
        this.status = status
        this.properties = properties
        this.customizable = customizable
        this.hotelId = hotelId
    }
}