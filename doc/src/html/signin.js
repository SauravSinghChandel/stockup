document.getElementById('signinForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8820/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        document.getElementById('resultContainer').innerText = JSON.stringify(data);

        window.location.href = 'login_page.html'

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resultContainer').innerText = 'An error occurred. Please try again.';
    }
});
