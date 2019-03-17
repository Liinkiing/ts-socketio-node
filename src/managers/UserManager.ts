import {User} from "../models/User";
import {Socket} from "socket.io";

export default new class UserManager {

    private users: User[] = []

    public connect = (socket: Socket) => {
        console.log(`socket with id ${socket.id} has been connected`)
        this.users = [...this.users, new User(socket)]
    }

    public disconnect = (socket: Socket) => {
        console.log(`socket with id ${socket.id} has been disconnected`)
        this.users = this.users.filter(user => user.id !== socket.id)
    }

}
