import {User} from "../models/User";
import {Socket} from "socket.io";
import Logger, {red} from "../services/Logger";

export default new class UserManager {

    private users: User[] = []

    public connect = (socket: Socket): void => {
        Logger.info(`socket with id ${red(socket.id)} has been connected`)
        this.users = [...this.users, new User(socket)]
    }

    public disconnect = (socket: Socket): void => {
        Logger.info(`socket with id ${red(socket.id)} has been disconnected`)
        this.users = this.users.filter(user => user.id !== socket.id)
    }

    public find = (socket: Socket): User | undefined => {
        return this.users.find(user => user.id === socket.id)
    }

}
