export type OutgoingMessages = {
    type: "bet";
}

export type COINS = 1 | 5 | 10 | 25 | 50 | 100 | 500 | 1000;

export type GameState = "people-can-bet" | "people-cannot-bet" | "game-over";