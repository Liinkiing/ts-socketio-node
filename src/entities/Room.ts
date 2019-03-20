import { randomBytes } from 'crypto'
import {User} from "./User";
import Logger, {red} from "../services/Logger";
import {OnRoomJoined, Serializable} from "../interfaces";
import {action, autorun, observable} from "mobx";
import RoomManager from "../managers/RoomManager";
import {Events} from "../enums";

export interface RoomSerialized {
    id: string,
    users: { id: string}[]
}

export class Room implements Serializable {

    public readonly id: string
    @observable private users: User[] = []

    public serialize = (): RoomSerialized => ({id: this.id, users: this.users.map(u => ({id: u.id}) )})

    public toString = (): string => {
        return `Room(id: ${red(this.id)})`
    }

    constructor(private readonly owner: User) {
        this.id = randomBytes(20).toString('hex')

        this.addUser(owner)
        owner.io.sockets.emit(Events.RoomCreated, this.serialize())
        Logger.success(`created room ${red(this.id)} with owner ${red(owner.id)}`)

        Logger.info(`setup autorun for ${this.toString()}`)
        autorun(() => {
            if (this.users.length === 0) {
                Logger.info(`deleting ${this.toString()} because all users left`)
                RoomManager.deleteRoom(this)
            }
        })
    }

    get io() {
        return this.owner.socket.server
    }

    @action public addUser = (user: User, onJoin?: OnRoomJoined): void => {
        user.room = this
        user.socket.leaveAll()
        user.socket.join(this.id, () => {
            user.io.sockets.in(this.id).emit(Events.RoomJoined, this.serialize())
            user.io.sockets.emit(Events.RoomRefresh, RoomManager.serializedRooms)
            Logger.success(`${user.toString()} joined ${this.toString()}`)
            if (onJoin) onJoin(user)
        })
        this.users = [...this.users, user]
    }

    @action public removeUser = (user: User): void => {
        user.room = null
        user.socket.leave(this.id, () => {
            user.io.sockets.in(this.id).emit(Events.RoomLeft, {room: this.serialize(), user: user.serialize()})
            this.users = this.users.filter(u => u.id !== user.id)
            user.io.sockets.emit(Events.RoomRefresh, RoomManager.serializedRooms)
        })
        Logger.info(`${user.toString()} left ${this.toString()}`)
    }

    @action public removeAllUsers = (): void => {
        this.users.forEach(this.removeUser)
    }

}
