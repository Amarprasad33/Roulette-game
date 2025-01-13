import { WebSocket } from "ws";
import { BettingNumber, COINS, GameState, IncomingMessages, OutgoingMessages } from "@repo/common/types";
import { GameManager } from "./GameManager";
const MULTIPLIER = 17;

export class User {
    id: number;
    name: string;
    balance: number;
    locked: number;
    ws: WebSocket;
    isAdmin: boolean;
    lastWon: number;

    constructor(id: number, name: string, ws: WebSocket, isAdmin: boolean) {
        this.id = id;
        this.name = name;
        this.balance = 2500;
        this.ws = ws;
        this.locked = 0;
        this.isAdmin = isAdmin;
        this.lastWon = 0;
        this.initHandlers();
    }
    initHandlers(){
        this.ws.on("message", (data: string) => {
            try{
                const message: IncomingMessages = JSON.parse(data);
                console.log("message", message)
                if(message.type === "bet"){
                    console.log("User bet");
                    this.bet(message.clientId, message.amount, message.number);
                }

                if(this.isAdmin && message.type === "start-game"){
                    console.log("Starting game");
                    if (GameManager.getInstance().state === GameState.GameOver){
                        GameManager.getInstance().start();
                    }
                }

                if(this.isAdmin && message.type === "end-game"){
                    console.log("end game");
                    if (GameManager.getInstance().state === GameState.CantBet){
                        GameManager.getInstance().end(message.output);
                    }
                }

                if(this.isAdmin && message.type === "stop-bets"){
                    console.log("Stop bets");
                    if (GameManager.getInstance().state === GameState.CanBet){
                        GameManager.getInstance().stopBets();
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })
    }

    flush(outcome: BettingNumber){
        if(this.lastWon === 0){
            this.send({
                type: "lost",
                balance: this.balance,
                locked: this.locked,
                outcome: outcome
            })
        } else {
            this.send({
                type: "won",
                balance: this.balance,
                locked: this.locked,
                wonAmount: this.lastWon,
                outcome: outcome
            })
        }
        this.lastWon = 0;
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
        const wonAmount = amount * (output === BettingNumber.Zero ? MULTIPLIER * 2 : MULTIPLIER);
        this.balance += wonAmount;
        this.locked -= amount;
        this.lastWon += wonAmount;
    }

    lost(amount: number, _output: BettingNumber){
        this.locked -= amount;
    }
}