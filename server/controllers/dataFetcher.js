import SqlConnector from "../dbConnections/SqlConnector.js";
import { SQLFileNames } from "../utils/conts.js";
import WebSocket from 'ws';
const db = await SqlConnector.init({ fileName: SQLFileNames.PEOPLE_DATA });

/**
 * Retrieves a person from the database by ID or returns all people if no ID is provided.
 * 
 * @param {Request} req - Express request object. Expects `req.query.id` (optional).
 * @param {Response} res - Express response object. Returns JSON data.
 * 
 * @returns {Promise<void>} Sends a JSON response containing the requested person or all people.
 */
async function getPeople(req, res) {
    const { id } = req.body;
    const params = []
    let query = "SELECT * FROM person";

    if (id) {
        params.push(id);
        query += " WHERE id = ?"
    }
    try {
        const data = await db.getAll(query, params);
        return res.status(200).json(data)
    } catch (e) {
        console.error(`Failed to get people data from SQL. Error: ${e.message}`)
        return res.status(500).json("Failed to get people data")
    }
}

/**
 * Fetches sensor data for a person **once** and returns an array of records.
 * @param {number} id - The person ID.
 * @returns {Promise<Array>} List of sensor data records.
 */
async function getSensorDataByPerson(id) {
    if (!id) {
        throw new Error("Cannot get sensor data for user. No ID provided.")
    }

    const query = "SELECT * FROM sample where person_id=?";
    const params = [id];
    try {

        const data = await db.getAll(query, params);
        return data
    } catch (e) {
        console.error(`Failed to get people data from SQL. Error: ${e.message}`)
        throw new Error("Failed to get sample data for user")
    }
}

/**
 * Streams sensor data for a person in real-time (120Hz).
 * @param {number} personId - The ID of the person.
 * @param {WebSocket} ws - The WebSocket connection.
 */
async function streamDataForPerson(personId, ws) {
    const sampleData = await getSensorDataByPerson(personId); 
    let index = 0; 

    const interval = setInterval(() => {
        if (ws.readyState !== WebSocket.OPEN) {
            clearInterval(interval);
            return;
        }

        if (index < sampleData.length) {
            const row = sampleData[index];
            ws.send(JSON.stringify(row));
            index++;
        } else {
            clearInterval(interval); 
        }
    }, 100); // Send at 10Hz

    ws.on("close", () => clearInterval(interval));
}


export {
    getPeople,
    streamDataForPerson
}