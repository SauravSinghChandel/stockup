// Call fetchActiveGames when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    async function fetchActiveGames() {
        try {
            const response = await fetch('http://localhost:8820/activeGames');

            const games = await response.json()
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
            <h4>${game.name}</h4>
            <li>Creator: ${game.creator}</li>
            <li>Players: ${game.players.length} / ${game.maxPlayers}</li>
            <li>Goal Amount: ${game.goalAmount}</li>
            <li>Start Amount: ${game.minAmount}</li>
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

