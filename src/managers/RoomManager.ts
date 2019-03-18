import {Room} from "../models/Room";
import {User} from "../models/User";
import {action, autorun, observable} from "mobx";
import Logger from "../services/Logger";
import {OnRoomJoined} from "../interfaces";

class RoomManager {

    @observable private rooms: Room[] = []

    constructor() {
        Logger.info('setup autorun for RoomManager')
        autorun(() => {
            console.log(this.rooms)
        })
    }

    @action public createRoom = (owner: User, onJoin?: OnRoomJoined): Room => {
        owner.leaveRoom()
        const room = new Room(owner);
        room.addUser(owner, onJoin)
        this.rooms = [...this.rooms, room]
        return room
    }

    @action public deleteRoom = (room: Room): void => {
        room.removeAllUsers()
        this.rooms = this.rooms.filter(r => r.id !== room.id)
        Logger.success(`deleted ${room.toString()}`)
    }

}

export default new RoomManager()
