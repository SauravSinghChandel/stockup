document.addEventListener('DOMContentLoaded', async () => {

    async function getCurrentGame(gameID) {
        const response = await fetch(`http://localhost:8820/getGame?gameID=${gameID}`)
        const data = await response.json();
        const game = data.game;

        return game;
    }
    const queryParams = new URLSearchParams(window.location.search);
    const gameID = queryParams.get('gameID');
    const game = await getCurrentGame(gameID)
    const username = queryParams.get('username');
    // Sample data for demonstration
    const playerData = game.players[`${username}`]
    console.log(game)
    console.log(playerData)

    async function calculatePortfolioValue(portfolio, stockList) {
        let totalValue = 0;

        for (const stockName in portfolio) {
            if (portfolio.hasOwnProperty(stockName)) {
                const quantity = portfolio[stockName];
                const stock = stockList.find(stock => stock.symbol === stockName);

                if (stock) {
                    const closingPrice = stock.closingPrice;
                    totalValue += quantity * closingPrice;
                } else {
                    console.log(`Stock "${stockName}" not found in stockList`);
                }
            }
        }

        if (totalValue >= game.goalAmount) {
            alert("You Won!")
            response = await fetch(`http://localhost:8820/endGame?gameID=${game.gameID}`, {
                method: "POST"
            })
            window.location.href = 'home.html'
        }

        return totalValue;
    }

    // Function to update player details
    async function updatePlayerDetails() {
        playerData.portfolioValue = await calculatePortfolioValue(playerData.portfolio, game.stockList)
        document.getElementById('playerName').textContent = `Player: ${playerData.name}`;
        document.getElementById('currentDay').textContent = `Day ${game.day + 1}`;
        document.getElementById('balance').textContent = `Balance: $${playerData.balance}`;
        document.getElementById('portfolioValue').textContent = `Portfolio Value: $${playerData.portfolioValue}`;
        const portfolioContainer = document.getElementById('portfolio');
        // Clear the existing content
        portfolioContainer.innerHTML = 'Portfolio:<br>(Stock: Count)';

        // Loop through each stock in the portfolio
        for (const stock in playerData.portfolio) {
            if (playerData.portfolio.hasOwnProperty(stock)) {
                const count = playerData.portfolio[stock];
                const stockItem = document.createElement('div');
                stockItem.textContent = `${stock}: ${count}`;
                portfolioContainer.appendChild(stockItem);
            }
        }
    }

    // Function to dynamically populate stock list
    function populateStockList() {
        const stockListContainer = document.getElementById('stockList');
        stockListContainer.innerHTML = ''; // Clear existing content

        game.stockList.forEach(stock => {
            const stockItem = document.createElement('div');
            stockItem.classList.add('stock-item');
            stockItem.innerHTML = `
            <p>${stock.symbol}</p>
            <p>Price: $${stock.openPrice}</p>
            <label for="buyQuantity">Quantity:</label>
            <input type="number" id="buyQuantity" class="buy-quantity" min="1" value="1">
            <button class="buy-btn">Buy</button>
            <label for="sellQuantity">Quantity:</label>
            <input type="number" id="sellQuantity" class="sell-quantity" min="1" value="1">
            <button class="sell-btn">Sell</button>
            `;
            stockListContainer.appendChild(stockItem);
        });
    }

    // Update player details and populate stock list on page load
    updatePlayerDetails();
    populateStockList();

    // Event listener for Next Day button
    const endGameBtn = document.getElementById('endGameBtn');
    endGameBtn.addEventListener('click', async () => {
            alert("You Won!")
            response = await fetch(`http://localhost:8820/endGame?gameID=${game.gameID}`, {
                method: "POST"
            })
            window.location.href = 'home.html'
    });

    // Event delegation for Buy and Sell buttons in stock list
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('buy-btn')) {
            const stockName = target.parentElement.querySelector('p').textContent;
            const quantityInput = target.parentElement.querySelector('.buy-quantity');
            const quantity = parseInt(quantityInput.value, 10);
            console.log(`Buying ${quantity} shares of ${stockName}`);
            buyStock(stockName, quantity, playerData, game.stockList);
        } else if (target.classList.contains('sell-btn')) {
            const stockName = target.parentElement.querySelector('p').textContent;
            const quantityInput = target.parentElement.querySelector('.sell-quantity');
            const quantity = parseInt(quantityInput.value, 10);
            console.log(`Selling ${quantity} shares of ${stockName}`);
            sellStock(stockName, quantity, playerData, game.stockList);
        }
    });


function buyStock(stockName, quantity, playerData, stockList) {

    // Update portfolio and balance
    if (stockName && quantity > 0) {
        // Check if user has enough balance
        const stockPrice = fetchStockPrice(stockName, stockList); // Example function to fetch stock price

        if (stockPrice * quantity <= playerData.balance) {
            if (!playerData.portfolio[stockName]) {
                playerData.portfolio[stockName] = quantity;
            } else {
                playerData.portfolio[stockName] += quantity;
            }
            playerData.balance -= stockPrice * quantity;
            console.log(playerData.balance)
            alert(`Sucessfully bought ${quantity} shares of ${stockName}`)
            updatePortfolioDisplay(playerData);
            updatePlayerDetails();
        } else {
            alert('Insufficient balance');
        }
    }
}

function sellStock(stockName, quantity, playerData, stockList) {
    // Logic to sell stocks

    // Update portfolio and balance
    if (stockName && quantity > 0 && playerData.portfolio[stockName] >= quantity) {
        const stockPrice = fetchStockPrice(stockName, stockList); // Example function to fetch stock price
        playerData.portfolio[stockName] -= quantity;
        playerData.balance += stockPrice * quantity;
        alert(`Sucessfully sold ${quantity} shares of ${stockName}`)
        updatePortfolioDisplay(playerData);
        updatePlayerDetails();
    } else {
        alert('Invalid quantity');
    }
}

function updatePortfolioDisplay(playerData) {
    const portfolioContainer = document.getElementById('portfolio');
    // Clear the existing content
    portfolioContainer.innerHTML = 'Portfolio:<br>(Stock: Count)';

    // Loop through each stock in the portfolio
    for (const stock in playerData.portfolio) {
        if (playerData.portfolio.hasOwnProperty(stock)) {
            const count = playerData.portfolio[stock];
            const stockItem = document.createElement('div');
            stockItem.textContent = `${stock}: ${count}`;
            portfolioContainer.appendChild(stockItem);
        }
    }
    document.getElementById('balance').textContent = `$${playerData.balance}`;

}

function fetchStockPrice(stockName, stockList) {
    const price = stockList.find(stock => stock.symbol === stockName).openPrice;
    return price; // Dummy data, replace with actual API call
}
});
