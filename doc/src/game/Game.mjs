class Game {
    constructor(name, creator, maxPlayers, duration, minAmount) {
        this.gameId = generateGameID(name);
        this.name = name;
        this.creator = creator;
        this.maxPlayers = maxPlayers;
        this.duration = duration;
        this.players = {};
        this.winner = {};
        this.minAmount = minAmount;
        this.completed = false;
    }

    addPlayer(player) {
        this.players[player.playerId] = player;
    }

    removePlayer(player) {
        const playerId = player.playerId;
        delete this.players[playerId];
    }

    toDatabase() {
        const game = {
            gameId: this.gameId,
            name: this.name,
            creator: this.creator,
            maxPlayer: this.maxPlayers,
            duration: this.duration,
            players: this.players,
            winner: this.winner,
            minAmount: this.minAmount,
        }

        return game;
    }

}

function generateGameID(name) {
    let key;
    time = Date.now().toString(36);

    key = `${name}-${time}`;

    return key;
}
