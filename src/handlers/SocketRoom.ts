import {Events} from "../enums";
import RoomManager from "../managers/RoomManager";
import Logger from "../services/Logger";
import UserManager from "../managers/UserManager";

class SocketRoom {

    public static handle = (socket: SocketIO.Socket) => {
        const user = UserManager.find(socket)

        socket.on(Events.RoomVerify, (id: string) => {
            const room = RoomManager.find(id)
            if (room) {
                user.connectToRoom(room)
            } else {
                Logger.warn(`${user.toString()} tried to join a non existent room`)
                socket.emit(Events.RoomUndefined)
            }
        })

        socket.on(Events.RoomCreate, () => {
            RoomManager.createRoom(user)
        })

        socket.on(Events.RoomLeave, (roomId: string) => {
            const room = RoomManager.find(roomId)
            if (room) {
                room.removeUser(user)
            }
        })
    }

}

export default SocketRoom
