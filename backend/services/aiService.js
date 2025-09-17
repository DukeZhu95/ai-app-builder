const axios = require('axios');

class AIService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        this.cohereApiKey = process.env.COHERE_API_KEY;
    }

    // Enhanced mock AI extraction with better intelligence
    mockExtractRequirements(description) {
        const text = description.toLowerCase();

        // App name extraction with better logic
        let appName = 'Generated App';
        const appKeywords = {
            'Course Management System': ['course', 'grade', 'student', 'teacher', 'education', 'school', 'university'],
            'E-commerce Platform': ['shop', 'store', 'product', 'buy', 'sell', 'order', 'customer', 'cart', 'payment'],
            'Task Management System': ['task', 'project', 'assignment', 'todo', 'workflow', 'team', 'collaborate'],
            'Blog Platform': ['blog', 'post', 'article', 'write', 'publish', 'content', 'author'],
            'Inventory Management': ['inventory', 'stock', 'warehouse', 'supply', 'goods', 'manage'],
            'Customer Relationship Management': ['customer', 'client', 'crm', 'relationship', 'contact', 'lead'],
            'Event Management System': ['event', 'booking', 'reservation', 'schedule', 'calendar', 'venue'],
            'Hospital Management System': ['hospital', 'patient', 'doctor', 'medical', 'health', 'clinic'],
            'Library Management System': ['library', 'book', 'borrow', 'return', 'catalog', 'member'],
            'Restaurant Management System': ['restaurant', 'menu', 'order', 'food', 'dining', 'kitchen'],
            'Real Estate Platform': ['property', 'real estate', 'house', 'rent', 'buy', 'listing'],
            'Social Media Platform': ['social', 'post', 'follow', 'like', 'share', 'friend', 'feed'],
            'Learning Management System': ['learning', 'course', 'lesson', 'quiz', 'exam', 'training'],
            'HR Management System': ['employee', 'hr', 'payroll', 'attendance', 'leave', 'recruitment'],
            'Financial Management System': ['finance', 'budget', 'expense', 'income', 'accounting', 'transaction']
        };

        // Find best matching app type
        let maxScore = 0;
        Object.keys(appKeywords).forEach(appType => {
            const score = appKeywords[appType].filter(keyword => text.includes(keyword)).length;
            if (score > maxScore) {
                maxScore = score;
                appName = appType;
            }
        });

        // Entity extraction with context awareness
        const entities = [];
        const entityKeywords = {
            'Student': ['student', 'pupil', 'learner', 'scholar'],
            'Teacher': ['teacher', 'instructor', 'professor', 'educator', 'faculty'],
            'Course': ['course', 'class', 'subject', 'lesson', 'module'],
            'Grade': ['grade', 'score', 'mark', 'result', 'assessment'],
            'User': ['user', 'person', 'people', 'member', 'individual'],
            'Product': ['product', 'item', 'goods', 'merchandise'],
            'Order': ['order', 'purchase', 'transaction', 'sale'],
            'Customer': ['customer', 'client', 'buyer', 'consumer'],
            'Task': ['task', 'assignment', 'job', 'activity', 'work'],
            'Project': ['project', 'initiative', 'program'],
            'Post': ['post', 'article', 'blog', 'content', 'publication'],
            'Comment': ['comment', 'review', 'feedback', 'response'],
            'Admin': ['admin', 'administrator', 'manager', 'supervisor'],
            'Employee': ['employee', 'staff', 'worker', 'personnel'],
            'Department': ['department', 'division', 'unit', 'section'],
            'Category': ['category', 'type', 'group', 'classification'],
            'Report': ['report', 'analytics', 'statistics', 'summary'],
            'Event': ['event', 'meeting', 'appointment', 'booking'],
            'Patient': ['patient', 'client', 'case'],
            'Doctor': ['doctor', 'physician', 'medical'],
            'Book': ['book', 'publication', 'volume'],
            'Author': ['author', 'writer', 'creator'],
            'Invoice': ['invoice', 'bill', 'receipt'],
            'Payment': ['payment', 'transaction', 'billing'],
            'Room': ['room', 'space', 'venue', 'location'],
            'Menu': ['menu', 'dish', 'meal', 'food'],
            'Property': ['property', 'house', 'apartment', 'listing']
        };

        Object.keys(entityKeywords).forEach(entity => {
            const matchCount = entityKeywords[entity].filter(keyword => text.includes(keyword)).length;
            if (matchCount > 0) {
                entities.push(entity);
            }
        });

        // Ensure minimum entities
        if (entities.length === 0) {
            entities.push('User', 'Item', 'Category');
        } else if (entities.length === 1) {
            entities.push('User');
        }

        // Role extraction with context
        const roles = [];
        const roleKeywords = {
            'Admin': ['admin', 'administrator', 'manager', 'supervisor'],
            'Teacher': ['teacher', 'instructor', 'professor', 'educator'],
            'Student': ['student', 'pupil', 'learner', 'scholar'],
            'Customer': ['customer', 'client', 'buyer', 'consumer'],
            'Seller': ['seller', 'vendor', 'merchant', 'supplier'],
            'Employee': ['employee', 'staff', 'worker', 'personnel'],
            'Doctor': ['doctor', 'physician', 'medical professional'],
            'Patient': ['patient', 'client'],
            'Author': ['author', 'writer', 'blogger', 'content creator'],
            'Reader': ['reader', 'subscriber', 'viewer'],
            'Manager': ['manager', 'supervisor', 'lead', 'coordinator'],
            'Owner': ['owner', 'proprietor', 'landlord'],
            'Tenant': ['tenant', 'renter', 'occupant'],
            'Moderator': ['moderator', 'moderates', 'moderate'],
            'User': ['user', 'member', 'participant']
        };

        Object.keys(roleKeywords).forEach(role => {
            const matchCount = roleKeywords[role].filter(keyword => text.includes(keyword)).length;
            if (matchCount > 0) {
                roles.push(role);
            }
        });

        // Ensure minimum roles
        if (roles.length === 0) {
            roles.push('Admin', 'User');
        } else if (roles.length === 1 && !roles.includes('Admin')) {
            roles.push('Admin');
        }

        // Feature extraction with intelligent mapping
        const features = [];
        const featureKeywords = {
            'Create Records': ['add', 'create', 'register', 'enroll', 'insert', 'new'],
            'Edit Records': ['edit', 'update', 'modify', 'change', 'revise'],
            'Delete Records': ['delete', 'remove', 'eliminate', 'drop'],
            'View Reports': ['report', 'analytics', 'dashboard', 'statistics', 'summary'],
            'Manage Users': ['manage', 'administer', 'control', 'oversee'],
            'Upload Files': ['upload', 'file', 'document', 'attach', 'import'],
            'Download Data': ['download', 'export', 'backup', 'save'],
            'Send Messages': ['message', 'chat', 'communicate', 'notify', 'email'],
            'Track Progress': ['track', 'progress', 'monitor', 'follow', 'observe'],
            'Generate Invoices': ['invoice', 'bill', 'payment', 'charge', 'billing'],
            'Search Data': ['search', 'find', 'filter', 'query', 'lookup'],
            'Schedule Events': ['schedule', 'calendar', 'appointment', 'booking'],
            'Approve Requests': ['approve', 'authorize', 'confirm', 'validate'],
            'Assign Tasks': ['assign', 'allocate', 'delegate', 'distribute'],
            'Grade Submissions': ['grade', 'score', 'evaluate', 'assess', 'mark'],
            'Process Orders': ['order', 'purchase', 'transaction', 'process'],
            'Manage Inventory': ['inventory', 'stock', 'supply', 'warehouse'],
            'Generate Reports': ['generate', 'produce', 'create report'],
            'Backup Data': ['backup', 'archive', 'store', 'preserve'],
            'Authentication': ['login', 'signin', 'authenticate', 'access'],
            'Role Management': ['role', 'permission', 'access control'],
            'Notification System': ['notification', 'alert', 'reminder', 'notice']
        };

        Object.keys(featureKeywords).forEach(feature => {
            const matchCount = featureKeywords[feature].filter(keyword => text.includes(keyword)).length;
            if (matchCount > 0) {
                features.push(feature);
            }
        });

        // Add context-specific features based on app type
        if (appName.includes('Course') || appName.includes('Learning')) {
            if (!features.some(f => f.includes('Grade'))) features.push('Grade Submissions');
            if (!features.some(f => f.includes('Schedule'))) features.push('Schedule Classes');
        }

        if (appName.includes('E-commerce') || appName.includes('Store')) {
            if (!features.some(f => f.includes('Order'))) features.push('Process Orders');
            if (!features.some(f => f.includes('Inventory'))) features.push('Manage Inventory');
        }

        if (appName.includes('Task') || appName.includes('Project')) {
            if (!features.some(f => f.includes('Assign'))) features.push('Assign Tasks');
            if (!features.some(f => f.includes('Track'))) features.push('Track Progress');
        }

        // Ensure minimum features
        if (features.length === 0) {
            features.push('Create Records', 'View Data', 'Manage Settings');
        } else if (features.length === 1) {
            features.push('View Data', 'Manage Settings');
        }

        return {
            appName,
            entities: [...new Set(entities)].slice(0, 8), // Limit to 8 entities
            roles: [...new Set(roles)].slice(0, 6), // Limit to 6 roles
            features: [...new Set(features)].slice(0, 10) // Limit to 10 features
        };
    }

    // OpenAI GPT integration
    async extractWithOpenAI(description) {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const prompt = `
You are an expert system analyst. Analyze the following app description and extract structured requirements.

App Description: "${description}"

Please extract and return a JSON object with exactly these fields:
{
  "appName": "A concise, descriptive name for the app",
  "entities": ["List of main data entities/objects in the app"],
  "roles": ["List of user roles/types who will use the app"],
  "features": ["List of key features/functionalities the app should have"]
}

Guidelines:
- appName: Should be professional and descriptive (e.g., "Student Course Management System")
- entities: Main objects/data types (e.g., "Student", "Course", "Grade") - max 8
- roles: User types (e.g., "Admin", "Teacher", "Student") - max 6  
- features: Key functionalities (e.g., "Create Course", "Assign Grades") - max 10
- Return only valid JSON, no additional text

Analyze the description and extract requirements:`;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant that extracts app requirements and returns only valid JSON.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.3
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content.trim();

            // Try to parse the JSON response
            let result;
            try {
                result = JSON.parse(content);
            } catch (parseError) {
                console.log('Failed to parse OpenAI response, using mock extraction');
                return this.mockExtractRequirements(description);
            }

            // Validate and clean the result
            return {
                appName: result.appName || 'Generated App',
                entities: Array.isArray(result.entities) ? result.entities.slice(0, 8) : ['User', 'Item'],
                roles: Array.isArray(result.roles) ? result.roles.slice(0, 6) : ['Admin', 'User'],
                features: Array.isArray(result.features) ? result.features.slice(0, 10) : ['Create Records', 'View Data']
            };

        } catch (error) {
            console.error('OpenAI API Error:', error.response?.data || error.message);

            if (error.response?.status === 429) {
                throw new Error('OpenAI rate limit exceeded');
            }

            // Fallback to mock extraction
            console.log('Falling back to mock extraction due to OpenAI error');
            return this.mockExtractRequirements(description);
        }
    }

    // Main extraction method - tries different AI services
    async extractRequirements(description) {
        const startTime = Date.now();

        try {
            // Try OpenAI first if available
            if (this.openaiApiKey && process.env.NODE_ENV === 'production') {
                console.log('🤖 Using OpenAI for requirement extraction');
                const result = await this.extractWithOpenAI(description);

                return {
                    ...result,
                    metadata: {
                        extractedAt: new Date().toISOString(),
                        processingTime: Date.now() - startTime,
                        model: 'openai-gpt-3.5-turbo',
                        confidence: 0.9
                    }
                };
            }

            // Fallback to enhanced mock extraction
            console.log('🔧 Using enhanced mock extraction');
            const result = this.mockExtractRequirements(description);

            return {
                ...result,
                metadata: {
                    extractedAt: new Date().toISOString(),
                    processingTime: Date.now() - startTime,
                    model: 'enhanced-mock',
                    confidence: 0.8
                }
            };

        } catch (error) {
            console.error('AI Service Error:', error.message);

            // Ultimate fallback
            const result = this.mockExtractRequirements(description);

            return {
                ...result,
                metadata: {
                    extractedAt: new Date().toISOString(),
                    processingTime: Date.now() - startTime,
                    model: 'fallback-mock',
                    confidence: 0.7,
                    error: error.message
                }
            };
        }
    }

    // Validate extracted requirements
    validateRequirements(requirements) {
        const errors = [];

        if (!requirements.appName || requirements.appName.trim().length === 0) {
            errors.push('App name is required');
        }

        if (!Array.isArray(requirements.entities) || requirements.entities.length === 0) {
            errors.push('At least one entity is required');
        }

        if (!Array.isArray(requirements.roles) || requirements.roles.length === 0) {
            errors.push('At least one role is required');
        }

        if (!Array.isArray(requirements.features) || requirements.features.length === 0) {
            errors.push('At least one feature is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Get service status
    getStatus() {
        return {
            openai: !!this.openaiApiKey,
            anthropic: !!this.anthropicApiKey,
            cohere: !!this.cohereApiKey,
            fallback: true, // Mock extraction always available
            recommended: this.openaiApiKey ? 'openai' : 'mock'
        };
    }
}

module.exports = new AIService();