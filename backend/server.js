// backend/server.js (updated from previous implementation)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb'); // Correct import
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/luxsuv';
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        // Optional: Ping to confirm connection
        await client.db('luxsuv').command({ ping: 1 });
        console.log('Pinged your deployment. Successfully connected to MongoDB!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if connection fails
    }
}

// Call the connection function (don’t close the client)
connectToMongoDB();

// Use the 'luxsuv' database
const db = client.db('luxsuv');
const bookingsCollection = db.collection('bookings');

// Store connected drivers
const drivers = new Set();

// WebSocket connection for drivers
wss.on('connection', async (ws) => {
    console.log('Driver connected');
    drivers.add(ws);

    // Send past bookings to the driver on connection
    try {
        const pastBookings = await bookingsCollection.find().sort({ createdAt: -1 }).limit(10).toArray();
        ws.send(JSON.stringify({ type: 'pastBookings', data: pastBookings }));
    } catch (err) {
        console.error('Error fetching past bookings:', err);
    }

    ws.on('close', () => {
        console.log('Driver disconnected');
        drivers.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        drivers.delete(ws);
    });
});

// API endpoint to handle booking form submission
app.post('/api/book', async (req, res) => {
    const bookingData = req.body;

    // Basic validation
    if (!bookingData.pickupLocation || !bookingData.dropoffLocation || !bookingData.date || !bookingData.time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize data
    const sanitizedData = {
        pickupLocation: bookingData.pickupLocation.trim(),
        dropoffLocation: bookingData.dropoffLocation.trim(),
        date: bookingData.date,
        time: bookingData.time,
        passengers: bookingData.passengers,
        vehicleType: bookingData.vehicleType,
        name: bookingData.name.trim(),
        email: bookingData.email.trim(),
        phone: bookingData.phone.trim(),
        createdAt: new Date(),
    };

    try {
        // Save to database
        const result = await bookingsCollection.insertOne(sanitizedData);
        sanitizedData._id = result.insertedId; // Add the inserted ID to the data

        // Send booking data to all connected drivers
        drivers.forEach((driver) => {
            if (driver.readyState === WebSocket.OPEN) {
                driver.send(JSON.stringify({ type: 'newBooking', data: sanitizedData }));
            }
        });

        res.status(200).json({ message: 'Booking submitted successfully' });
    } catch (err) {
        console.error('Error saving booking:', err);
        res.status(500).json({ error: 'Failed to save booking' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});