import {Room, RoomSerialized} from "../entities/Room";
import {User} from "../entities/User";
import {action, autorun, computed, observable} from "mobx";
import Logger from "../services/Logger";
import {OnRoomJoined} from "../interfaces";
import {Events} from "../enums";

class RoomManager {

    @observable private rooms: Room[] = []

    constructor() {
        Logger.info('setup autorun for RoomManager')
        autorun(() => {
            console.log(this.rooms.map(r => r.serialize()))
        })
    }

    public exists = (room: Room): boolean => {
        return !!this.rooms.find(r => r.id === room.id)
    }

    public find = (id: string): Room | undefined => {
        return this.rooms.find(r => r.id === id)
    }

    @action public createRoom = (owner: User, onJoin?: OnRoomJoined): Room => {
        owner.leaveRoom()
        const room = new Room(owner);
        this.rooms = [...this.rooms, room]

        return room
    }

    @action public deleteRoom = (room: Room): void => {
        room.io.sockets.emit(Events.RoomDeleted, room.serialize())
        room.removeAllUsers()
        this.rooms = this.rooms.filter(r => r.id !== room.id)
        Logger.success(`deleted ${room.toString()}`)
    }

    @computed get serializedRooms(): RoomSerialized[] {
        return this.rooms.map(room => room.serialize())
    }

}

export default new RoomManager()
