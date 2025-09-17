const mongoose = require('mongoose');

// Define the App Schema
const AppSchema = new mongoose.Schema({
    appName: {
        type: String,
        required: [true, 'App name is required'],
        trim: true,
        minlength: [2, 'App name must be at least 2 characters long'],
        maxlength: [100, 'App name cannot exceed 100 characters'],
        unique: true,
        index: true
    },

    description: {
        type: String,
        trim: true,
        maxlength: [5000, 'Description cannot exceed 5000 characters'],
        default: ''
    },

    entities: [{
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Entity name cannot be empty'],
        maxlength: [50, 'Entity name cannot exceed 50 characters']
    }],

    roles: [{
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Role name cannot be empty'],
        maxlength: [50, 'Role name cannot exceed 50 characters']
    }],

    features: [{
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'Feature name cannot be empty'],
        maxlength: [100, 'Feature name cannot exceed 100 characters']
    }],

    // Metadata fields
    originalDescription: {
        type: String,
        trim: true,
        maxlength: [5000, 'Original description cannot exceed 5000 characters']
    },

    status: {
        type: String,
        enum: ['draft', 'active', 'archived'],
        default: 'draft'
    },

    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],

    // AI extraction metadata
    aiMetadata: {
        extractedAt: {
            type: Date,
            default: Date.now
        },
        processingTime: {
            type: Number, // in milliseconds
            min: 0
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0.8
        },
        model: {
            type: String,
            default: 'mock-ai'
        }
    },

    // Usage statistics
    stats: {
        views: {
            type: Number,
            default: 0,
            min: 0
        },
        lastViewed: {
            type: Date
        },
        generatedCount: {
            type: Number,
            default: 1,
            min: 1
        }
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Removes __v field
});

// Indexes for better query performance
AppSchema.index({ appName: 'text', description: 'text' });
AppSchema.index({ createdAt: -1 });
AppSchema.index({ status: 1 });
AppSchema.index({ 'entities': 1 });
AppSchema.index({ 'roles': 1 });

// Virtual for app age
AppSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Virtual for entity count
AppSchema.virtual('entityCount').get(function() {
    return this.entities ? this.entities.length : 0;
});

// Virtual for role count
AppSchema.virtual('roleCount').get(function() {
    return this.roles ? this.roles.length : 0;
});

// Virtual for feature count
AppSchema.virtual('featureCount').get(function() {
    return this.features ? this.features.length : 0;
});

// Include virtuals when converting to JSON
AppSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret._id;
        return ret;
    }
});

// Pre-save middleware
AppSchema.pre('save', function(next) {
    // Ensure arrays don't contain empty strings
    this.entities = this.entities.filter(entity => entity && entity.trim() !== '');
    this.roles = this.roles.filter(role => role && role.trim() !== '');
    this.features = this.features.filter(feature => feature && feature.trim() !== '');

    // Remove duplicate entries
    this.entities = [...new Set(this.entities)];
    this.roles = [...new Set(this.roles)];
    this.features = [...new Set(this.features)];

    // Capitalize first letter of entities and roles
    this.entities = this.entities.map(entity =>
        entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()
    );
    this.roles = this.roles.map(role =>
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    );

    next();
});

// Instance methods
AppSchema.methods.incrementViews = function() {
    this.stats.views += 1;
    this.stats.lastViewed = new Date();
    return this.save();
};

AppSchema.methods.updateGeneration = function() {
    this.stats.generatedCount += 1;
    return this.save();
};

AppSchema.methods.archive = function() {
    this.status = 'archived';
    return this.save();
};

AppSchema.methods.activate = function() {
    this.status = 'active';
    return this.save();
};

// Static methods
AppSchema.statics.findByName = function(name) {
    return this.findOne({
        appName: { $regex: new RegExp(name, 'i') }
    });
};

AppSchema.statics.findByEntity = function(entity) {
    return this.find({
        entities: { $in: [new RegExp(entity, 'i')] }
    });
};

AppSchema.statics.findByRole = function(role) {
    return this.find({
        roles: { $in: [new RegExp(role, 'i')] }
    });
};

AppSchema.statics.getPopularApps = function(limit = 10) {
    return this.find({ status: 'active' })
        .sort({ 'stats.views': -1, createdAt: -1 })
        .limit(limit);
};

AppSchema.statics.getRecentApps = function(limit = 10) {
    return this.find({ status: { $ne: 'archived' } })
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Error handling
AppSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('An app with this name already exists'));
    } else {
        next(error);
    }
});

// Export the model
module.exports = mongoose.model('App', AppSchema);