import { WebSocket } from "ws";
import { BettingNumber, COINS, IncomingMessages, OutgoingMessages } from "@repo/common/types";
import { GameManager } from "./GameManager";
const MULTIPLIER = 17;

export class User {
    id: number;
    name: string;
    balance: number;
    locked: number;
    ws: WebSocket;
    isAdmin: boolean;

    constructor(id: number, name: string, ws: WebSocket, isAdmin: boolean) {
        this.id = id;
        this.name = name;
        this.balance = 2500;
        this.ws = ws;
        this.locked = 0;
        this.isAdmin = isAdmin;
        this.initHandlers();
    }

    initHandlers(){
        this.ws.on("message", (data: string) => {
            try{
                const message: IncomingMessages = JSON.parse(data);
                if(message.type === "bet"){
                    this.bet(message.clientId, message.amount, message.number);
                }

                if(this.isAdmin && message.type === "start-game"){
                    GameManager.getInstance().start();
                }

                if(this.isAdmin && message.type === "end-game"){
                    GameManager.getInstance().end(message.output);
                }

                if(this.isAdmin && message.type === "stop-bets"){
                    GameManager.getInstance().stopBets();
                }
            } catch (e) {
                console.error(e);
            }
        })
    }

    bet(cliendId: string, amount: COINS, betNumber: BettingNumber) {
        if(this.balance < amount) {
            this.send({
                cliendId,
                type: "bet-undo",
                amount,
                balance: this.balance,
                locked: this.locked,
            });
            return;
        }
        this.balance -= amount;
        this.locked += amount;
        const response = GameManager.getInstance().bet(amount, betNumber, this.id);
        if(response){
            this.send({
                cliendId,
                type: "bet",
                amount,
                balance: this.balance,
                locked: this.locked,
            });
        } else{
            this.send({
                cliendId,
                type: "bet-undo",
                amount,
                balance: this.balance,
                locked: this.locked,
            });
        }
    }

    send(payload: OutgoingMessages){
        this.ws.send(JSON.stringify(payload));
    }

    won(amount: number, output: BettingNumber){
        this.balance += amount * (output === BettingNumber.Zero ? MULTIPLIER * 2 : MULTIPLIER);
        this.locked -= amount;
        this.send({
            type: "won",
            balance: this.balance,
            locked: this.locked,
        })
    }

    lost(amount: number, _output: BettingNumber){
        this.locked -= amount;
        this.send({
            type: "lost",
            balance: this.balance,
            locked: this.locked,
        })
    }
}