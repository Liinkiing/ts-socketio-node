import {Socket} from "socket.io";

export class User {

    public id: string

    constructor(private readonly socket: Socket) {
        this.id = socket.id
    }

}
