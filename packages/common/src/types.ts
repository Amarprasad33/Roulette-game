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
} | {
    type: "lost";
    balance: number;
    locked: number;
} | {
    type: "start-game"
} | {
    type: "end-game";
    output: BettingNumber
} | {
    type: "stop-bets"
}

export enum COINS {
    One,
    Five,
    Ten,
    TwentyFive,
    Fifty,
    Hundred,
    TwoHundredFifty,
    FiveHundred,
    Thousand
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