import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import {getPeople} from "./controllers/dataFetcher.js";
import { subscribeToPersonData } from "./subscriptions/personDataSubscriber.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// middleware
app.use(express.json());
app.use(cors());
// routes
app.get('/api/people', getPeople);



const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');
    ws.on('message', (message)=>subscribeToPersonData(message, ws));
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});
