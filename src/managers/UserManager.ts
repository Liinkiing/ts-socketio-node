import {User} from "../entities/User";
import {Socket} from "socket.io";
import Logger, {red} from "../services/Logger";
import {action, observable} from "mobx";

class UserManager {

    @observable private users: User[] = []

    @action public connect = (socket: Socket): User => {
        Logger.info(`socket with id ${red(socket.id)} has been connected`)
        const user = new User(socket);
        this.users = [...this.users, user]
        return user
    }

    @action public disconnect = (user: User): void => {
        if (user.room) {
            user.leaveRoom()
        }
        this.users = this.users.filter(u => u.id !== user.id)
        Logger.info(`socket with id ${red(user.id)} has been disconnected`)
    }

    public find = (socket: Socket): User | undefined => {
        return this.users.find(user => user.id === socket.id)
    }

}

export default new UserManager()
