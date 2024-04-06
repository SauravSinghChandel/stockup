document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const gameID = queryParams.get('gameID');
    console.log(gameID);

    const createGameForm = document.getElementById('createGameForm');
    const resultContainer = document.getElementById('resultContainer');

    createGameForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const maxPlayers = document.getElementById('maxPlayers').value;
        const duration = document.getElementById('duration').value;
        const minAmount = document.getElementById('minAmount').value;
        const goalAmount = document.getElementById('goalAmount').value;
        console.log(name)

        try {
            const response = await fetch('http://localhost:8820/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, maxPlayers, duration, minAmount, goalAmount }),
                credentials: 'include', // Ensure session cookies are sent
            });

            const data = await response.json();
            resultContainer.innerHTML = `<p>${data.message}</p><p>Game ID: ${data.gameID}</p>`;
            console.log("Game Created")
            window.location.href = 'home.html'
        } catch (error) {
            console.error('Error creating game:', error);
            resultContainer.innerHTML = '<p>An error occurred. Please try again.</p>';
        }
    });
});

