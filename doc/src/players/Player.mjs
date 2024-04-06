import { findInCollection } from "../storage/DatabaseConnection.mjs";

export class Player {
    constructor(name, game) {
        this.name = name;
        this.balance = game.minAmount;
        this.gameID = game.gameID;
        this.portfolio = {};
        this.portfolioValue = 0;
    }

    toDatabase() {
        const player = {
            name: this.name,
            balance: this.balance,
            gameID: this.gameID,
            portfolio: this.portfolio,
            portfolioValue: this.portfolioValue,
        }

        return player
    }

    calculatePortfolioValue() {
    }
}

export async function createPlayer(client, username, gameID) {

    console.log("In the createPlayer functuion")
    query = { "username": username }

    let player = new Player(username, gameID)
    return player

    /*
    const userDetails = await findInCollection(client, query, "users");

    console.log("user details", userDetails)
    if (userDetails.length === 0 ) {
        return false;
    } else {
        console.log("Player is being created")
        let player = new Player(username, game)
        return player
    }*/
}
