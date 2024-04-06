import { insertToCollection } from "../storage/DatabaseConnection.mjs";

export class Game {
    constructor(name, creator, maxPlayers, duration, minAmount, goalAmount) {
        this.gameID = generateGameID(name);
        this.name = name;
        this.creator = creator;
        this.maxPlayers = maxPlayers;
        this.duration = duration; // [start, end]
        this.players = {};
        this.winner = null;
        this.minAmount = minAmount;
        this.completed = false;
        this.goalAmount = goalAmount;
        this.day = 0;
        this.stockList = null;
    }

    addPlayer(player) {
        this.players[player.playerId] = player;
    }

    removePlayer(player) {
        const playerId = player.playerId;
        delete this.players[playerId];
    }

    async toDatabase(client) {
        const game = {
            gameID: this.gameID,
            name: this.name,
            creator: this.creator,
            maxPlayer: this.maxPlayers,
            duration: this.duration,
            players: this.players,
            winner: this.winner,
            minAmount: this.minAmount,
        }

        await insertToCollection(client, game, "games");

        return ;
    }

}

function generateGameID(name) {
    let key;
    const time = Date.now().toString(36);

    key = `${name}-${time}`;

    return key;
}
