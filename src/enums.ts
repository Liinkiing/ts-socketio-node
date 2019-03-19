export enum SocketEvents {
    Connect = "connect",
    Connection = "connection",
    Disconnect = "disconnect",
}

export enum Events {
    RoomCreate = "room:create",
    RoomCreated = "room:created",
    RoomRetrieve = "room:retrieve",
    RoomRefresh = "room:refresh",
    RoomDeleted = "room:deleted",
    RoomVerify = "room:verify",
    RoomUndefined = "room:undefined",
    RoomJoined = "room:joined",
    RoomLeave = "room:leave",
    RoomLeft = "room:left",
}
