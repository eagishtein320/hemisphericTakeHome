import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Card, CardContent, Button } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Chart({ person }) {
    const MAX_MESSAGES = 500; // Limit stored messages
    const [messages, setMessages] = useState([]);
    const [selectedSensors, setSelectedSensors] = useState(new Set());
    const socketRef = useRef(null);
    const emaRef = useRef({}); // Store EMA values separately

    const sensorColors = [
        '#8884d8', '#82ca9d', '#FF8042', '#FFBB28', '#8A2BE2',
        '#FF6347', '#2E8B57', '#FFD700', '#ADFF2F', '#F0E68C',
        '#98FB98', '#D2691E', '#FF4500', '#B0E0E6', '#A52A2A',
        '#5F9EA0', '#C71585', '#DC143C', '#9932CC'
    ];

    useEffect(() => {
        if (socketRef.current) return;

        socketRef.current = new WebSocket("ws://localhost:3001");

        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
            socketRef.current.send(JSON.stringify({ action: "subscribe", persons: [person.id] }));
        };

        socketRef.current.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            const parsedData = JSON.parse(receivedData.data);

            const formattedData = {
                timestamp: receivedData.timestamp,
                ...Array.from({ length: 19 }).reduce((acc, _, index) => {
                    acc[`sensor_${index + 1}`] = Math.floor(parsedData[index]);
                    return acc;
                }, {}),
            };

            // Compute EMA inline
            for (let i = 1; i <= 19; i++) {
                const key = `sensor_${i}`;
                emaRef.current[key] = emaRef.current[key]
                    ? (0.1 * formattedData[key]) + (0.9 * emaRef.current[key]) // EMA formula
                    : formattedData[key];

                formattedData[`ema_${key}`] = emaRef.current[key];
            }

            setMessages((prevMessages) => {
                if (prevMessages.length >= MAX_MESSAGES) {
                    prevMessages.shift(); // Remove oldest entry
                }
                return [...prevMessages, formattedData];
            });
        };

        socketRef.current.onclose = (event) => console.log("WebSocket closed:", event.code, event.reason);
        socketRef.current.onerror = (error) => console.error("WebSocket error:", error);

        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
            socketRef.current = null;
        };
    }, [person]);

    const formatTimestamp = (timestamp) => new Date(timestamp * 1000).toUTCString().split(" ")[4];

    const toggleSensor = (sensor) => {
        setSelectedSensors((prev) => {
            const newSelection = new Set(prev);
            newSelection.has(sensor) ? newSelection.delete(sensor) : newSelection.add(sensor);
            return newSelection;
        });
    };

    const resetSelection = () => setSelectedSensors(new Set());

    const allSensors = Array.from({ length: 19 }).map((_, i) => `sensor_${i + 1}`);
    const isShowingAll = selectedSensors.size === 0 || selectedSensors.size === allSensors.length;

    return (
        <Container className="chart">
            <Card>
                <Typography variant="h4" gutterBottom>
                    Real-Time Sensor Data: {person.name}
                </Typography>
                <CardContent>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                        <Button variant={isShowingAll ? "contained" : "outlined"} onClick={resetSelection}>
                            Show All
                        </Button>
                        {allSensors.map((sensorKey, index) => (
                            <Button
                                key={sensorKey}
                                variant={selectedSensors.has(sensorKey) ? "contained" : "outlined"}
                                onClick={() => toggleSensor(sensorKey)}
                            >
                                {sensorKey}
                            </Button>
                        ))}
                    </div>

                    <LineChart
                        width={800}
                        height={400}
                        data={messages.map((message) => ({
                            ...message,
                            formattedTimestamp: formatTimestamp(message.timestamp),
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="formattedTimestamp" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {(isShowingAll ? allSensors : Array.from(selectedSensors)).map((sensorKey, index) => (
                            <React.Fragment key={sensorKey}>
                                <Line
                                    type="monotone"
                                    dataKey={sensorKey}
                                    stroke={sensorColors[index % sensorColors.length]}
                                    strokeWidth={1.5}
                                    name={sensorKey}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={`ema_${sensorKey}`}
                                    stroke={sensorColors[index % sensorColors.length]}
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                    name={`${sensorKey} (EMA)`}
                                />
                            </React.Fragment>
                        ))}
                    </LineChart>
                </CardContent>
            </Card>
        </Container>
    );
}
