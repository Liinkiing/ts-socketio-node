import {User} from "./models/User";

type Some = { [key: string]: Some } | object | string | boolean | symbol | number | null;

export type OnRoomJoined = (user: User) => void;

export interface Serializable {
    serialize: Some
}
