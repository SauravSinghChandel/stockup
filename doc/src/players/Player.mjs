export class Player {
    constructor(name, balance, game, portfolio) {
        this.name = name;
        this.balance = balance;
        this.game = game;
        this.portfolio = portfolio;
    }

    toDatabase() {
        const player = {
            name: this.name,
            balance: this.balance,
            game: this.game,
            portfolio: this.portfolio,
        }

        return player
    }
}
