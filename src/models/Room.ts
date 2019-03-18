import { randomBytes } from 'crypto'
import {User} from "./User";
import Logger, {red} from "../services/Logger";
import {OnRoomJoined, Serializable} from "../interfaces";
import {action, autorun, observable} from "mobx";
import RoomManager from "../managers/RoomManager";

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

    constructor(owner: User) {
        this.id = randomBytes(20).toString('hex')
        Logger.info(`setup autorun for ${this.toString()}`)
        autorun(() => {
            if (this.users.length === 0) {
                Logger.info(`destroying ${this.toString()} because all users left`)
                RoomManager.deleteRoom(this)
            }
        })
        Logger.success(`created room ${red(this.id)} with owner ${red(owner.id)}`)
    }

    @action public addUser = (user: User, onJoin?: OnRoomJoined): void => {
        user.room = this
        user.socket.leaveAll()
        user.socket.join(this.id, () => {
            Logger.info(`${user.toString()} joined ${this.toString()}`)
            if (onJoin) onJoin(user)
        })
        this.users = [...this.users, user]
    }

    @action public removeUser = (user: User): void => {
        user.room = null
        user.socket.leaveAll()
        Logger.info(`${user.toString()} left ${this.toString()}`)
        this.users = this.users.filter(u => u.id !== user.id)
    }

    @action public removeAllUsers = (): void => {
        this.users.forEach(this.removeUser)
    }

}
