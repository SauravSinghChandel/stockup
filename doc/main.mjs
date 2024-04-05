import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser'
import { aggregate, getDailySnapshot } from './src/services/APIService.mjs';
import { connectToDatabase, disconnectDatabase } from './src/storage/DatabaseConnection.mjs';
import { registerUser, verifyLogin } from './src/auth/authentication.mjs';
import { Game } from './src/game/Game.mjs';
import { Player, createPlayer } from './src/players/Player.mjs';


const app = express();
const port = 8820;

const client = await connectToDatabase();

let activeGames = [];

const staticFilesPath = "./src/html"

function checkLoggedIn(req) {
    if (req.session.isLoggedIn) {
        return true; // Continue to the next middleware or route handler
    } else {
        return false; // Redirect to the login page if not logged in
    }
}

app.use(session({
    secret: "this_is_secret_dont_look_at_it",
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.json());

app.use(express.static(staticFilesPath));

app.get('/', (req, res) => {
    const data = null;

    if (checkLoggedIn(req)) {
        res.sendFile('/src/html/index.html', { root: '.' })
    } else {
        res.sendFile('/src/html/login_page.html', { root: '.' })
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/aggregate', async (req, res) => {

    const ticker = req.query.ticker;
    const multiplier = req.query.multiplier;
    const timespan = req.query.timespan;
    const from = req.query.from;
    const to = req.query.to;

    try {
        const data = await aggregate(ticker, multiplier, timespan, from, to);
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);

        return res.status(401).json({ 'message': "Not found" })
    }


})

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const validLogin = await verifyLogin(client, username, password)

        if (validLogin) {
            req.session.username = username;
            req.session.isAdmin = false;
            req.session.isLoggedIn = true;
            console.log("$$$$$$$$$$$$$$$$$$$$$$$", req.session.isAdmin, req.session.username, req.session.isLoggedIn)

            return res.status(200).json({ "message": "Login successful" });

        } else {
            return res.status(401).json({ 'message': "Unauthorized" })
        }
    } catch (err) {
        console.error(err)
        res.status(401)
    }
})

app.post('/admin', (req, res) => {

    const isLoggedIn = req.session.isLoggedIn;
    console.log("############################", req.session.username, req.session.isLoggedIn, req.session.isAdmin)


    if (!isLoggedIn) {
        console.log("You need to log in first!")
        return res.status(401).json({
            "message": "Not logged in"
        })
    }

    try {

        const makeAdmin = Boolean(req.query.makeAdmin);
        req.session.isAdmin = !makeAdmin


        return res.status(200).send(req.session);

    } catch (err) {
        console.error(err);

        return res.status(400).send(req.session.isAdmin);
    }
});

app.get('/activeGames', (req, res) => {
    res.json(activeGames)
    return activeGames;
})


app.get('/logout', (req, res) => {
    // Destroy session
    req.session.destroy();

    console.log("Logged out successfully")
    res.send('Logged out successfully');
});

app.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {

        const register = await registerUser(client, res, username, password)

        if (register) {

            req.sessionID = username;

            return res.status(200).json({ "Ok": "Ok" })
        } else {
            return res.status(401).json({ "Error": "Username already exists" })
        }


    } catch (err) {
        console.error("Error found: ", err)

        return res.status(401).json({ "Error": err })
    }

})

app.get('/dailySnapshot', async (req, res) => {
    const data = await getDailySnapshot(req.query.date);

    return res.status(200).send(data)
})

app.post('/createGame', (req, res) => {


    const gameName = req.body.name;
    const maxPlayes = req.body.maxPlayers;
    const duration = req.body.duration;
    const minAmount = req.body.minAmount;
    const goalAmount = req.body.goalAmount;

    if (req.session.isAdmin) {

        try {

            const newGame = new Game(gameName, req.session.username, maxPlayes, duration, minAmount, goalAmount);
            activeGames.push(newGame)

            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", req.session)

            return res.status(200).json({
                "message": "Game created successfully",
                "gameID": newGame.gameID
            })


        } catch (err) {
            console.error(err);
            return res.status(400)
        }
    } else {
        return res.status(401).json({
            'message': "Does not have Admin access"
        })
    }
})

app.post('/endGame', async (req, res) => {
    const gameID = req.query.gameID;

    try {

        console.log("active games", activeGames);
        let gameToRemove = activeGames.filter(game => game.gameID === gameID)[0];


        if (gameToRemove instanceof Game) {

            const playersArray = Object.values(gameToRemove.players);

            const winner = playersArray.reduce((maxPlayer, currentPlayer) => {
                return currentPlayer.balance > maxPlayer.balance ? currentPlayer : maxPlayer;
            }, { name: '', balance: -Infinity }); // Set initial maxPlayer with lowest possible balance


            gameToRemove.completed = true;
            gameToRemove.winner = winner
            await gameToRemove.toDatabase(client);
            activeGames = activeGames.filter(game => game.gameID !== gameID);

            return res.status(200).json({
                "message": `Game (${gameToRemove.gameID}) removed successfully`
            })
        } else {
            return res.status(404).json({
                "message": `Game (${gameToRemove.gameID}) not found`
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(400);
    }
});

app.post('/joinGame', async (req, res) => {

    let player;
    console.log(req)
    console.log("heY")
    const gameID = req.query.gameID;

    let game = activeGames.find(game => game.gameID === gameID)

    console.log("Yello")
    if (game instanceof Game) {

        console.log("I am in", req.session.username)

        //let player = await createPlayer(client, req.session.username, game);

        console.log("Session: \n#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*\n", gameID)
        player = new Player(req.session.username, game);
        console.log("Player: ", player)

        game.players[req.session.username] = player

        return res.status(200).json({
            "message": `Player ${player.username} has joined Game ${game.gameID}`
        })

    } else {
        return res.status(404).json({
            "message": `Game (${gameID}) not found`
        })
    }
});

app.post('/buyStock', async (req, res) => {
    const { symbol, quantity } = req.body;

    try {
        // Validate symbol and quantity
        // Perform the buy transaction logic
        // Update user's portfolio or account balance

        return res.status(200).json({ message: 'Stock bought successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error buying stock' });
    }
});

app.post('/sellStock', async (req, res) => {
    const { symbol, quantity } = req.body;

    try {
        // Validate symbol, quantity, and user's stock holdings
        // Perform the sell transaction logic
        // Update user's portfolio or account balance

        return res.status(200).json({ message: 'Stock sold successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error selling stock' });
    }
});

app.get('/portfolio', async (req, res) => {
    try {
        // Retrieve user's portfolio from the database
        // Return the portfolio data

        return res.status(200).json(portfolioData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching portfolio' });
    }
});

app.get('/stockPrice', async (req, res) => {
    const { symbol } = req.query;

    try {
        // Fetch the current price of the stock symbol from an external API or database
        // Return the stock price

        return res.status(200).json({ symbol, price: stockPrice });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching stock price' });
    }
});

app.on('close', async () => {
    disconnectDatabase(client);
    console.log("Connection to MongoDB closed")
});

export default app;
export { activeGames };
