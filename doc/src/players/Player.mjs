import { findInCollection } from "../storage/DatabaseConnection.mjs";

export class Player {
    constructor(name, game) {
        this.name = name;
        this.balance = game.minAmount;
        this.game = game;
        this.portfolio = {};
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

export async function createPlayer(client, username, game) {

    console.log("In the createPlayer functuion")
    query = { "username": username }

    let player = new Player(username, game)
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