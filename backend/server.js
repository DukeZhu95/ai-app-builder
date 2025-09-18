const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-app-builder';

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Connected Successfully');
        console.log(`📡 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);

        // For development, continue without MongoDB
        if (process.env.NODE_ENV === 'development') {
            console.log('⚠️  Continuing in development mode without database...');
        } else {
            process.exit(1);
        }
    }
};

// Connect to Database
connectDB();

// Test AI Service on startup
const aiService = require('./services/aiService');
console.log('🤖 AI Service Status:', aiService.getStatus());

// Routes
app.use('/api', require('./routes/api'));

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'AI App Builder Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🤖 Welcome to AI App Builder API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            extractRequirements: 'POST /api/extract-requirements',
            saveApp: 'POST /api/save-app',
            getApps: 'GET /api/apps'
        },
        documentation: 'Visit /health for server status'
    });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: [
            'GET /',
            'GET /health',
            'POST /api/extract-requirements',
            'POST /api/save-app',
            'GET /api/apps'
        ]
    });
});

// Global Error Handler
app.use((error, req, res, next) => {
    console.error('❌ Global Error:', error);

    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(error.status || 500).json({
        error: 'Internal Server Error',
        message: isDevelopment ? error.message : 'Something went wrong',
        ...(isDevelopment && { stack: error.stack })
    });
});

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');

    try {
        await mongoose.connection.close();
        console.log('📪 Database connection closed');
    } catch (error) {
        console.error('❌ Error closing database:', error);
    }

    process.exit(0);
});

// Start Server
app.listen(PORT, () => {
    console.log('🚀 =======================================');
    console.log(`🌟 AI App Builder Backend Server Started`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log('🚀 =======================================');
});