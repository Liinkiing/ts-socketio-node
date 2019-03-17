import {Room} from "../models/Room";
import {Socket} from "socket.io";
import UserManager from "./UserManager";

export default new class RoomManager {

    private rooms: Room[] = []

    public createRoom = (owner: Socket): void => {
        const user = UserManager.find(owner)
        this.rooms = [...this.rooms, new Room(user)]
    }

}
