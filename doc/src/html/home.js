async function joinGame(gameID, username) {
    try {
        const response = await fetch(`http://localhost:8820/joinGame?gameID=${gameID}`, {
            method: 'POST',
            credentials: 'include', // Include credentials if using cookies for session management
        });

        const data = await response.json();
        console.log("data", data); // Log the response from the server

        // Redirect to the current_game page with the game ID as a URL parameter
        window.location.href = `current_game.html?gameID=${gameID}&username=${username}`;
    } catch (error) {
        console.error('Error joining game:', error);
    }
}

// Call fetchActiveGames when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {

    const usernameContainer = document.getElementById('usernameContainer');
    const usernameSpan = document.getElementById('usernameSpan');
    const logoutBtn = document.getElementById('logoutBtn');

    async function getUserDetails() {
        const response = await fetch('http://localhost:8820/getUserDetails', {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        const userDetails = data.userDetails;

        return userDetails;
    };

    function displayUsername(data) {
        const username = data.username;

        usernameSpan.textContent = username;
    }

    const userDetails = await getUserDetails()
    displayUsername(userDetails);

    async function logout() {
        const response = await fetch('http://localhost:8820/logout')
        console.log('Logged Out')

        window.location.href = 'login_page.html';
    }

    logoutBtn.addEventListener('click', logout);


    async function fetchActiveGames() {
        try {
            const response = await fetch('http://localhost:8820/activeGames');

            const games = await response.json()
            console.log(games)
            displayActiveGames(games);
        } catch (error) {
            console.error('Error fetching active games:', error);
        }
    }

    // Display active games on the home page
    function displayActiveGames(games) {
        const gamesContainer = document.getElementById('gamesContainer');
        if (!games || games.length === 0) {
            gamesContainer.innerHTML = '<p>No active games available.</p>';
            return;
        }


        const gamesList = games.map(game => `
                <div>
                    <h4>${game.name}</h4>
                    <ul>
                        <li>Creator: ${game.creator}</li>
                        <li>Players: ${game.players.length} / ${game.maxPlayers}</li>
                        <li>Goal Amount: ${game.goalAmount}</li>
                        <li>Start Amount: ${game.minAmount}</li>
                    </ul>
                    <button onclick="joinGame('${game.gameID}', '${userDetails.username}')">Join Game</button>
                </div>
            `).join('');

        gamesContainer.innerHTML = `<ul>${gamesList}</ul>`;
    }


    fetchActiveGames();

    const createGameBtn = document.getElementById('createGameBtn');

    createGameBtn.addEventListener('click', () => {
        console.log("Button clicked")
        window.location.href = 'create_game.html'; // Redirect to create game page
    });
    const getAdminBtn = document.getElementById('getAdminBtn');
    getAdminBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:8820/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ makeAdmin: true }), // Assuming you want to set admin permission
                credentials: 'include', // Ensure session cookies are sent
            });

            const data = await response.json();
            console.log(data); // Log the response from the server
        } catch (error) {
            console.error('Error getting admin permissions:', error);
        }
    });
});

