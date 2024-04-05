document.addEventListener('DOMContentLoaded', () => {
    const createGameForm = document.getElementById('createGameForm');
    const resultContainer = document.getElementById('resultContainer');

    createGameForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const gameName = document.getElementById('gameName').value;
        const maxPlayers = document.getElementById('maxPlayers').value;
        const duration = document.getElementById('duration').value;
        const minAmount = document.getElementById('minAmount').value;
        const goalAmount = document.getElementById('goalAmount').value;

        try {
            const response = await fetch('http://localhost:8820/createGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameName, maxPlayers, duration, minAmount, goalAmount }),
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

