import express from "express";
import expressWs from "express-ws";
import basicAuth from "express-basic-auth";

const app = express();
const port = process.env.PORT || 3000;

const moderatorPassword = process.env.MODERATOR_PASSWORD || Math.floor(Math.random() * 1e16).toString(16);

const appWs = expressWs(app);

/**
 * @typedef LeaderboardEntry
 * @property {number} id
 * @property {string} playerName
 * @property {number} score
 * @property {Date} submittedAt
 */

/** @type {LeaderboardEntry[]} */
const leaderboard = [];

// Serve static content from `public` directory
app.use(express.static("public"));

// Automatically parse JSON request bodies
app.use(express.json());

// Automatically parse HTML Form request bodies
app.use(express.urlencoded({ extended: true }));

const auth = basicAuth({
    users: { "moderator": moderatorPassword },
    challenge: true,
});

app.get("/api/leaderboard", (request, response) => {
    response.setHeader("Content-Type", "application/json");
    response.send(JSON.stringify(leaderboard));
});

app.ws("/api/leaderboard", (ws, request) => {
    const count = appWs.getWss().clients.size;
    console.log(`WebSocket client connected (Currently connected: ${count})`);

    ws.on("close", () => {
        const count = appWs.getWss().clients.size;
        console.log(`WebSocket client disconnected (Currently connected: ${count})`);
    });
});

app.post("/api/leaderboard", (request, response) => {
    const playerName = request.body.name;
    const score = +request.body.score;

    if (!playerName || isNaN(score)) {
        response.status(400);
        response.send("playerName or score is missing")
        return;
    }

    const id = Math.round(Math.random() * 1e6);

    const newEntry = {
        id,
        playerName,
        score,
        submittedAt: new Date(),
    };

    addToLeaderBoard(newEntry);

    response.status(201);

    response.location(`/api/leaderboard/${id}`);

    response.send(newEntry);

    // Announce to WebSocket clients
    announceLeaderboard();
});

app.get("/api/leaderboard/:id", (request, response) => {
    const entry = leaderboard.find(e => e.id === +request.params.id);

    if (entry) {
        response.setHeader("Content-Type", "application/json");
        response.send(JSON.stringify(entry));
    }
    else {
        response.status(404);
        response.send();
    }
});

// Require Basic Auth for this endpoint
app.use("/api/leaderboard/:id", auth);

app.delete("/api/leaderboard/:id", (request, response) => {
    const entry = leaderboard.find(e => e.id === +request.params.id);

    if (!entry) {
        response.status(404);
        response.send();
        return;
    }

    const index = leaderboard.indexOf(entry);
    leaderboard.splice(index, 1);

    response.send();

    // Announce to WebSocket clients
    announceLeaderboard();
});

// Require Basic Auth for this endpoint
app.use("/api/moderation/verify", auth);

app.get("/api/moderation/verify", (req, res) => {
    res.send("ok");
});

app.listen(port, () => {
    console.log(`Server running at http://0.0.0.0:${port}`);

    if (!process.env.MODERATOR_PASSWORD) {
        console.log("Moderator password: " + moderatorPassword);
    }
});

function announceLeaderboard() {
    appWs.getWss().clients.forEach((/** @type {WebSocket} */ client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ leaderboard }));
        }
    });
}

/**
 * @param {LeaderboardEntry} newEntry
 */
function addToLeaderBoard(newEntry) {
    leaderboard.push(newEntry);

    leaderboard.sort((a, b) => {
        const diff = b.score - a.score;

        if (diff !== 0) {
            return diff;
        }

        return +a.submittedAt - +b.submittedAt;
    });

    leaderboard.length = Math.min(100, leaderboard.length);
}