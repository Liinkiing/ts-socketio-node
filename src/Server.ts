import * as express from "express"
import {Express} from "express"
import * as socketio from "socket.io"
import {Server as HttpServer} from 'http'
import UserManager from "./managers/UserManager";
import {SocketEvents} from "./enums";
import SocketRoom from "./handlers/SocketRoom";

export default new class Server {

    private app: Express
    private http: HttpServer
    private io: socketio.Server

    public port: number = Number(process.env.PORT) || 4444

    public init = (): this => {
        this.app = express()
        this.app.set("port", this.port)
        this.http = new HttpServer(this.app)
        this.io = socketio(this.http)

        return this
    }

    public listen = (listener?: (port: number) => void): this => {
        this.http.listen(this.port, () => {
            if (listener) {
                listener(this.port)
            }
        })

        this.io.on(SocketEvents.Connect, socket => {
            const user = UserManager.connect(socket)

            SocketRoom.handle(socket)

            socket.on(SocketEvents.Disconnect, () => {
                UserManager.disconnect(user)
            })
        })

        return this
    }

}
