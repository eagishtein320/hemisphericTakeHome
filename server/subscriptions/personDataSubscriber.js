
import {streamDataForPerson}  from "../controllers/dataFetcher.js";

/**
 * Handles incoming WebSocket messages for subscriptions.
 * @param {string} message - The received message.
 * @param {WebSocket} ws - The WebSocket connection.
 */
async function subscribeToPersonData(message, ws){
    try {
        const request = JSON.parse(message);

        if (request.action === 'subscribe' && Array.isArray(request.persons)) {
            request.persons.forEach(personId => {
                streamDataForPerson(personId, ws);
            });
        }
    } catch (err) {
        console.error('Invalid message format:', err);
    }
}


export  {
    subscribeToPersonData
}