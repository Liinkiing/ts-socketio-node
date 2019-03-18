import {Socket} from "socket.io";
import {Serializable} from "../interfaces";
import {red} from "../services/Logger";
import {Room, RoomSerialized} from "./Room";

export interface UserSerialized {
    id: string,
    room: RoomSerialized | null
}

export class User implements Serializable {

    public id: string
    public room: Room

    constructor(public readonly socket: Socket) {
        this.id = socket.id
    }

    public leaveRoom = (): void => {
        if (this.room) {
            this.room.removeUser(this)
        }
    }

    public serialize = (): UserSerialized => {
        return { id: this.id, room: this.room ? this.room.serialize() : null }
    }

    public toString = (): string => {
        return `User(id: ${red(this.id)})`
    }

}
