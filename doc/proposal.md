# Project Proposal

# StockUP

## Description

StockUp: The Stock Trading Game Web Application is an engaging online platform that simulates stock trading competitions among players. In this virtual environment, participants create and manage their stock portfolios, aiming to achieve the highest portfolio value by the end of the game/competition. The game combines strategic decision-making, market analysis, and competitive elements to provide an immersive experience for players.

## Screens

*Note: These images are not accurate representation of the final configuration, color scheme or scaling.*

### Login
![Login](screens/login_page.png)

### Home
![Home](screens/home_page.png)

### Play
![Play](screens/play_page.png)

### Player Interface
![Player Interface](screens/player_interface_page.png)

### Create
![Create](screens/create_page.png)

### Admin Interface
![Admin Interface](screens/admin_interface_page.png)

### Friends
![Friends](screens/friends_page.png)

## Features

| ID  | Name                  | Access By | Short Description                                  | Expected Implementation | Source of Idea         |
|-----|-----------------------|------------|----------------------------------------------------|--------------------------|------------------------|
| 01  | Account registration  | Player     | Players register for a specific game               | Must implement          | Project instructions  |
| 02  | Game duration         | Admin      | Configure start/end of each game individually      | Likely to be done        | Other games I know     |
| 03  | Moving Average        | Player     | An added feature to candlestick charts             | Probably not unless easy | Social Media         |
| 04  | Changing User Details | Player     | Players can change their username, passwords or profile pictures  | Highly Likely | Other games I know|
| 05 | Stock exchange| Player | Allows players to buy and sell stocks| Must implement| Project instructions|
| 06 | Stock alerts | Player | Allows players to set alerts sensitive to stock values| Likely| Stock Market                    |
| 07 | Goal                   | Player        | End critera for players to win the game| Must implement| Project Instructions                    |
| 08 | Game creation| Admin        | Create new game lobbies for players to join| Must implement| Project instructions                    |
| 09 | Leaderboards| Player        | Shows portfolio values of all the players in the lobby| Must implement| Project suggestions|
| 10 | Graphs| Player | Displays the graph of a company stock within a selected time frame with set intervals| Must implement| Stock Market|
| 11 | Live Drawing| Player| Allows players to draw lines, highlight and other features| Likely                      | Trading apps                    |
| 12 | Friends| Player| Players can add people as their friends to later invite to play| Likely |Other games I know|
| 13 | Invite Friends | Admin| Admins can invite their friends to join their lobbies| Likeyly | Other games I know|
| 14 | Clubs| Player | Players can join or create clubs to have all the friends together | Might be done | Other games I Know|
| 15 | Chatrooms | Plyaer | In-game and Club chatrooms so players can talk | Probably if easy| Other games I know|
| 16 | Practice games | Player| Players can create practice games to try their new strategies | Highly likely | Other games I know|
| 17 | Bots | Player | Bots to fill up practice games to simulate other players | Probably if its easy | Other games I know|
| 18 | View game history | Player | Players can see or their friends past game history | Probably if its easy | Other games I know|
| 19 | Unique friend code | User | Users can search other users by their unique friend code | Highly likely| Other games I know|
| 20 | Team Battles| User | Clubs can make teams and play against teams from other clubs | If time allows | Other games I know|
| 21 | Club hierarchy | Club members| Hierarchy system in clubs | If time allows| Other games in know|
| 22 | Manage players| Admin| Kick or mute players| Must implement|Other games I know|
| 23 | Mute players | Players | Mute incoming messages from other players | Depends on other feature | Other games I know|
| 24 | Achievements | Users | Unlock special achievements based on certain criteria | Probably if easy | Other games I know|
| 25 | Themes | Users | Allows users to select different color themes | If time allows  | Dark and Light mode |
| 26 | Global Leaderboards | Users | Shows top users with most wins in the past week | If time allows | Other games I know|
| 27 | Stock history| Player | Players can search performance of a particular stock in the past | Highly Likely| Stock market|
| 28 | Public Lobbies | Player | Players can join public lobbies from a suggestion menu | Probably if easy | Other games I know|
| 29 | Private Lobbies | Player | Players can join with a code or be invited to the lobbeis | Must be implemenetd | Other games I know |
| 30 | Report players | Player | Players can report others to Admins for toxic behaviour | Probably if easy | Other games I know |
| ... | ...                   | ...        | ...                                                | ...                      | ...                    |

## Moving Average (Feature ID: 03)

**Description:**
The moving average feature involves adding an additional layer to candlestick charts, providing users with a trend indicator. This can be implemented by calculating and plotting the moving average of stock prices over a specified period.

**Implementation:**
- Calculate the moving average based on the historical stock prices.
- Plot the moving average line on the candlestick chart for the player to observe trends.

## Changing User Details (Feature ID: 04)

**Description:**
This feature allows players to update their user details, including changing their username, passwords, or profile pictures.

**Implementation:**
- Provide a user-friendly interface for users to modify their details.
- Ensure proper validation and security measures for password changes.

## Clubs (Feature ID: 14 )

**Description:**
Players come together to form a group where they can chat, have team battles, share strategies. 

**Implementations:**
- Have a hierarchy like Leader, Executive and Members
- Leaders can manage other members 

## Bots (Feature ID: 17 )

**Description:**
Bots can be used to fill in practice games and simulate other players.

**Implementations:**
- First, they will follow a normall random distribution curve to buy or sell a certain stock 
- Second, if time allows, they will have algorithms to maximize profit and have better simulation of other players 

## Implementation

### Tools and Packages
- Frontend: HTML, CSS, TypeScript, React
- Backend: Node.js
- Database: MongoDB
- Stock Price API: Alpha Vantage

### App API

**1. Account Registration:**

- Endpoint: `POST /api/account/register`
- Description: Request to register a new player account for a specific game.
- Response: Success or failure indication.

**2. Game Duration Configuration:**

- Endpoint: `PUT /api/admin/game/configure`
- Description: Request to configure the start and end times of each game individually.
- Response: Success or failure indication.

**3. Moving Average Feature:**

- Endpoint: `GET /api/player/moving-average`
- Description: Request to retrieve the moving average data for candlestick charts.
- Response: Moving average data.

**4. Changing User Details:**

- Endpoint: `PUT /api/player/change-details`
- Description: Request to allow players to change their username, passwords, or profile pictures.
- Response: Success or failure indication.

**5. Stock Exchange - Buy:**

- Endpoint: `POST /api/player/buy-stock`
- Description: Request to enable players to buy stocks.
- Response: Stock buy success or failure.

**6. Stock Exchange - Sell:**

- Endpoint: `POST /api/player/sell-stock`
- Description: Request to allow players to sell stocks.
- Response: Stock sell success or failure.

**7. Goal Definition:**

- Endpoint: `PUT /api/player/set-goal`
- Description: Request to set the criteria for players to win the game.
- Response: Success or failure indication.

**8. Game Creation:**

- Endpoint: `POST /api/admin/create-game`
- Description: Request for admins to create new game lobbies for players to join.
- Response: Success or failure indication.

**9. Leaderboards:**

- Endpoint: `GET /api/player/leaderboard`
- Description: Request to retrieve the leaderboard data, showing portfolio values of all players in the lobby.
- Response: Leaderboard data.

**10. Graphs - Stock Performance:**

- Endpoint: `GET /api/player/stock-performance`
- Description: Request to display the graph of a company stock within a selected time frame with set intervals.
- Response: Stock performance graph data.

### Stock API

Use Alpha Vantage API for retrieving stock prices:

1. `GET /stocks/current?symbol=tickersymbol`: Retrieves the current stock price for a given symbol.
2. `GET /stocks/history?symbol=tickersymbol&interval=daily`: Retrieves historical stock prices for a given symbol.



## Attributions
I acknowledge the contribution of classmates in generating feature ideas during discussions.
I also would like to acknowledge the contribution of ChatGPT in formatting the project description and checking for grammar.

---
