import { randomBytes } from 'crypto'
import {User} from "./User";
import Logger, {red} from "../services/Logger";

export class Room {

    private readonly id: string
    private users: User[]

    constructor(owner: User) {
        this.id = randomBytes(20).toString('hex')
        Logger.success(`created room ${red(this.id)} with owner ${red(owner.id)}`)
    }
}
