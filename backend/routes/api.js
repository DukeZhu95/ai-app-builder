const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const App = require('../models/App');

// Middleware for request logging
router.use((req, res, next) => {
    console.log(`📝 API Request: ${req.method} ${req.path} at ${new Date().toISOString()}`);
    next();
});

// Extract Requirements Endpoint
router.post('/extract-requirements', async (req, res) => {
    try {
        const { description } = req.body;

        // Validation
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'Description is required and must be a non-empty string'
            });
        }

        if (description.length > 5000) {
            return res.status(400).json({
                error: 'Input too long',
                message: 'Description must be less than 5000 characters'
            });
        }

        console.log(`🤖 Processing requirement extraction for: "${description.substring(0, 100)}..."`);

        // Use AI service to extract requirements
        const requirements = await aiService.extractRequirements(description.trim());

        console.log(`✅ Requirements extracted successfully:`, requirements);

        // Add metadata
        const response = {
            ...requirements,
            metadata: {
                originalDescription: description.trim(),
                extractedAt: new Date().toISOString(),
                processingTime: Date.now() - req.startTime
            }
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('❌ Error in extract-requirements:', error);

        // Handle specific AI service errors
        if (error.message.includes('API key')) {
            return res.status(500).json({
                error: 'AI Service Configuration Error',
                message: 'AI service is not properly configured. Please check server configuration.'
            });
        }

        if (error.message.includes('rate limit')) {
            return res.status(429).json({
                error: 'Rate Limit Exceeded',
                message: 'Too many requests. Please try again later.'
            });
        }

        res.status(500).json({
            error: 'Processing Error',
            message: 'Failed to extract requirements. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Save Generated App
router.post('/save-app', async (req, res) => {
    try {
        const { appName, entities, roles, features, description } = req.body;

        // Validation
        if (!appName || !entities || !roles || !features) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'appName, entities, roles, and features are required'
            });
        }

        console.log(`💾 Saving app: ${appName}`);

        // Create new app document
        const newApp = new App({
            appName: appName.trim(),
            description: description?.trim() || '',
            entities: Array.isArray(entities) ? entities : [],
            roles: Array.isArray(roles) ? roles : [],
            features: Array.isArray(features) ? features : [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedApp = await newApp.save();

        console.log(`✅ App saved successfully with ID: ${savedApp._id}`);

        res.status(201).json({
            message: 'App saved successfully',
            app: savedApp,
            id: savedApp._id
        });

    } catch (error) {
        console.error('❌ Error saving app:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Duplicate App',
                message: 'An app with this name already exists'
            });
        }

        res.status(500).json({
            error: 'Database Error',
            message: 'Failed to save app. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get All Apps
router.get('/apps', async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        // Build query
        let query = {};
        if (search) {
            query = {
                $or: [
                    { appName: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Execute query with pagination
        const apps = await App.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await App.countDocuments(query);

        console.log(`📋 Retrieved ${apps.length} apps (page ${page} of ${Math.ceil(total / limit)})`);

        res.status(200).json({
            apps,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalApps: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('❌ Error fetching apps:', error);

        res.status(500).json({
            error: 'Database Error',
            message: 'Failed to fetch apps. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get Single App
router.get('/apps/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'Please provide a valid app ID'
            });
        }

        const app = await App.findById(id).select('-__v');

        if (!app) {
            return res.status(404).json({
                error: 'App Not Found',
                message: 'No app found with the provided ID'
            });
        }

        console.log(`📱 Retrieved app: ${app.appName}`);

        res.status(200).json(app);

    } catch (error) {
        console.error('❌ Error fetching app:', error);

        res.status(500).json({
            error: 'Database Error',
            message: 'Failed to fetch app. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Delete App
router.delete('/apps/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'Please provide a valid app ID'
            });
        }

        const deletedApp = await App.findByIdAndDelete(id);

        if (!deletedApp) {
            return res.status(404).json({
                error: 'App Not Found',
                message: 'No app found with the provided ID'
            });
        }

        console.log(`🗑️ Deleted app: ${deletedApp.appName}`);

        res.status(200).json({
            message: 'App deleted successfully',
            deletedApp: {
                id: deletedApp._id,
                appName: deletedApp.appName
            }
        });

    } catch (error) {
        console.error('❌ Error deleting app:', error);

        res.status(500).json({
            error: 'Database Error',
            message: 'Failed to delete app. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test Endpoint
router.get('/test', (req, res) => {
    res.json({
        message: '🧪 API Test Successful',
        timestamp: new Date().toISOString(),
        server: 'AI App Builder Backend',
        version: '1.0.0'
    });
});

module.exports = router;