import { Bet, BettingNumber, GameState } from "@repo/common/types";
import { UserManager } from "./UserManager";

export class GameManager {
    state: GameState = GameState.GameOver;
    bets: Bet[] = [];
    private static _instance: GameManager;
    private _lastWinner: BettingNumber = BettingNumber.Zero;
    
    private constructor(){}

    public static getInstance(): GameManager {
        if(!this._instance){
            this._instance = new GameManager();
        }
        return this._instance;
    }

    // For end user
    public bet(amount: number, betNumber: BettingNumber, id: number): boolean{
        if(this.state === GameState.CanBet){
            this.bets.push({ id, amount, number: betNumber })
            return true; // For confirming that bet has been done
        }
        return false;
    }

    // For Admin
    public start(){
        this.state = GameState.CanBet;
        UserManager.getInstance().brodcast({
            type: "start-game"
        })
    }
    stopBets(){
        this.state = GameState.CantBet;
        UserManager.getInstance().brodcast({
            type: "stop-bets"
        })
    }

    public end(output: BettingNumber){
        this._lastWinner = output;
        this.bets.forEach((bet) => {
            if(bet.number === output){
                UserManager.getInstance().won(bet.id, bet.amount, output);
            } else{
                UserManager.getInstance().lost(bet.id, bet.amount, output);
            }
        })

        this.state = GameState.GameOver;
        this._lastWinner = output;
        UserManager.getInstance().flush(output);
        this.bets = [];
    }
}