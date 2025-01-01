import { WebSocket } from "ws";
import { BettingNumber, OutgoingMessages } from '@repo/common/types'
import { User } from "./User";

let ID = 1;


export class UserManager {
    private _users: {[key: string]: User} = {};
    private static _instance: UserManager;

    constructor() {

    }

    public static getInstance(): UserManager {
        if(!this._instance){
            this._instance = new UserManager();
        }
        return this._instance
    }

    addUser(ws: WebSocket, name: string, isAdmin: boolean) {
        let id = ID;
        this._users[id] = new User(
            id, name, ws, isAdmin
        );

        ws.on("close", () => this.removeUser(id))
        ID++;
    }

    removeUser(id: number) {
        delete this._users[id];
        // this._users = this._users.filter(u => u.id !== id);
    }

    /**
     * Brocast message to everyone who has joined except the sender
     */

    brodcast(message: OutgoingMessages, id?: number){
        Object.keys(this._users).forEach((userId) => {
            const user = this._users[userId] as User;
            if(id !== user.id){
                user?.send(message)
            }
        })
    }
 
    won(id: number, amount: number, output: BettingNumber){
        this._users[id]?.won(amount, output);
    }

    lost(id: number, amount: number, output: BettingNumber){
        this._users[id]?.lost(amount, output);
    }
}