export type IncomingMessages = {
    type: "bet";
    clientId: string;
    amount: number;
    number: number;
} | {
    type: "start-game"
} | {
    type: "end-game";
    output: BettingNumber
} | {
    type: "stop-bets"
}

export type OutgoingMessages = {
    type: "current-state";
    state: GameState;
} | {
    type: "bet";
    cliendId: string;
    amount: number;
    balance: number;
    locked: number;
} | {
    type: "bet-undo";
    cliendId: string;
    amount: number;
    balance: number;
    locked: number;
} | {
    type: "won";
    balance: number;
    locked: number;
    wonAmount: number;
    outcome: BettingNumber;
} | {
    type: "lost";
    balance: number;
    locked: number;
    outcome: BettingNumber;
} | {
    type: "start-game"
} | {
    type: "end-game";
    output: BettingNumber
} | {
    type: "stop-bets"
}

export enum COINS {
    One = 1,
    Five = 5,
    Ten = 10,
    TwentyFive = 25,
    Fifty = 50,
    Hundred = 100,
    TwoHundredFifty = 250,
    FiveHundred = 500,
    Thousand = 1000
}

export enum GameState {
    CanBet,
    CantBet,
    GameOver
}

export enum BettingNumber {
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve,
    Thirteen,
    Fourteen,
    Fifteen,
    Sixteen,
    Seventeen,
    Eighteen,
    Nineteen,
    Twenty,
    TwentyOne,
    TwentyTwo,
    TwentyThree,
    TwentyFour,
    TwentyFive,
    TwentySix,
    TwentySeven,
    TwentyEight,
    TwentyNine,
    Thirty,
    ThirtyOne,
    ThirtyTwo,
    ThirtyThree,
    ThirtyFour,
    ThirtyFive,
    ThirtySix,
}
export type Bet = {
    id: number;
    amount: number;
    number: BettingNumber
}