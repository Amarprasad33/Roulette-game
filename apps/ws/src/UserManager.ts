import { WebSocket } from "ws";
import { OutgoingMessages } from './types'
import { User } from "./User";

let ID = 1;


export class UserManager {
    private _users: User[];
    private static _instance: UserManager;

    constructor() {

    }

    public static getInstance(): UserManager {
        if(!this._instance){
            this._instance = new UserManager();
        }
        return this._instance
    }

    addUser(ws: WebSocket, name: string) {
        let id = ID;
        this._users.push(new User(
            id, name, ws
        ));

        ws.on("close", () => this.removeUser(id))
        ID++;
    }

    removeUser(id: Number) {
        this._users = this._users.filter(u => u.id !== id);
    }

    /**
     * Brocast message to everyone who has joined except the sender
     */

    brodcast(message: OutgoingMessages, userId?: Number){
        this._users.forEach(({ id, ws }) => {
            if(userId !== id){
                ws.send(JSON.stringify(message))
            }
        })
    }
}