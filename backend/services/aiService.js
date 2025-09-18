const axios = require('axios');

class AIService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
    }

    // Enhanced OpenAI GPT integration with comprehensive prompting
    async extractWithOpenAI(description) {
        if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not configured');
        }

        const systemPrompt = `You are an expert system analyst and software architect. Your job is to analyze app descriptions and extract structured requirements for building applications.

You must return ONLY valid JSON in this exact format:
{
  "appName": "A professional, descriptive name for the application",
  "entities": ["Array of main data objects/entities the app manages"],
  "roles": ["Array of user types who will interact with the app"],
  "features": ["Array of key functionalities the app should provide"]
}

Guidelines:
- appName: Should be clear and professional (e.g., "Forum Discussion Platform", "E-commerce Store", "Chess Game Portal")
- entities: Core data objects (e.g., for a forum: ["Post", "User", "Comment", "Category"])
- roles: User types (e.g., ["Admin", "Moderator", "Member", "Guest"])
- features: Key functionalities (e.g., ["Create Post", "Reply to Comments", "Moderate Content"])
- Maximum 8 entities, 6 roles, 10 features
- Be creative and comprehensive based on the description
- Consider the app's domain and purpose carefully`;

        const userPrompt = `Analyze this app description and extract requirements:

"${description}"

Think about:
1. What type of application is this? (e.g., social platform, game, e-commerce, management system)
2. What are the main data objects it needs to manage?
3. Who are the different types of users?
4. What key actions/features should it support?

Return only the JSON object with extracted requirements.`;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.3, // Lower temperature for more consistent output
                    top_p: 0.9
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.openaiApiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const content = response.data.choices[0].message.content.trim();
            console.log('🤖 OpenAI Raw Response:', content);

            // Try to parse the JSON response
            let result;
            try {
                // Remove any markdown code block formatting
                const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
                result = JSON.parse(cleanContent);
            } catch (parseError) {
                console.error('Failed to parse OpenAI response:', parseError);
                console.log('Raw content:', content);
                throw new Error('AI returned invalid JSON format');
            }

            // Validate and clean the result
            const cleanedResult = {
                appName: result.appName || 'AI Generated App',
                entities: Array.isArray(result.entities) ? result.entities.slice(0, 8).filter(e => e && e.trim()) : ['User', 'Item'],
                roles: Array.isArray(result.roles) ? result.roles.slice(0, 6).filter(r => r && r.trim()) : ['Admin', 'User'],
                features: Array.isArray(result.features) ? result.features.slice(0, 10).filter(f => f && f.trim()) : ['Create Records', 'View Data']
            };

            // Ensure minimum requirements
            if (cleanedResult.entities.length === 0) cleanedResult.entities = ['User', 'Item'];
            if (cleanedResult.roles.length === 0) cleanedResult.roles = ['Admin', 'User'];
            if (cleanedResult.features.length === 0) cleanedResult.features = ['Create Records', 'View Data'];

            return cleanedResult;

        } catch (error) {
            console.error('OpenAI API Error:', error.response?.data || error.message);

            if (error.response?.status === 429) {
                throw new Error('OpenAI rate limit exceeded. Please try again in a moment.');
            }

            if (error.response?.status === 401) {
                throw new Error('Invalid OpenAI API key. Please check your configuration.');
            }

            if (error.response?.status === 400) {
                throw new Error('Invalid request to OpenAI API.');
            }

            // Re-throw the error to be handled by fallback
            throw error;
        }
    }

    // Intelligent fallback extraction for when OpenAI is unavailable
    intelligentFallbackExtraction(description) {
        console.log('🔧 Using intelligent fallback extraction');

        const text = description.toLowerCase();

        // Comprehensive app type detection
        const appTypes = {
            'Forum Platform': ['forum', 'discussion', 'community', 'thread', 'reply', 'post discussion'],
            'E-commerce Platform': ['shop', 'store', 'buy', 'sell', 'product', 'cart', 'checkout', 'order', 'ecommerce'],
            'Social Media Platform': ['social', 'follow', 'like', 'share', 'post', 'feed', 'friend', 'profile'],
            'Gaming Platform': ['game', 'play', 'player', 'match', 'score', 'level', 'chess', 'puzzle'],
            'Blog Platform': ['blog', 'article', 'write', 'publish', 'author', 'content', 'wordpress'],
            'Learning Management System': ['course', 'lesson', 'student', 'teacher', 'quiz', 'assignment', 'grade'],
            'Task Management System': ['task', 'todo', 'project', 'assign', 'team', 'workflow', 'kanban'],
            'Chat Application': ['chat', 'message', 'conversation', 'real-time', 'instant', 'messenger'],
            'Music Platform': ['music', 'song', 'artist', 'playlist', 'stream', 'listen', 'album'],
            'Video Platform': ['video', 'watch', 'stream', 'upload', 'channel', 'youtube', 'content'],
            'Dating Platform': ['dating', 'match', 'profile', 'swipe', 'relationship', 'meet'],
            'Food Delivery Platform': ['food', 'restaurant', 'order', 'delivery', 'menu', 'cuisine'],
            'Real Estate Platform': ['property', 'house', 'rent', 'buy', 'listing', 'real estate'],
            'Fitness Platform': ['fitness', 'workout', 'exercise', 'health', 'gym', 'training'],
            'News Platform': ['news', 'article', 'journalist', 'report', 'breaking', 'headline'],
            'Event Management System': ['event', 'booking', 'ticket', 'venue', 'calendar', 'schedule'],
            'Inventory Management System': ['inventory', 'stock', 'warehouse', 'supply', 'manage goods'],
            'CRM Platform': ['customer', 'crm', 'lead', 'sales', 'contact', 'relationship'],
            'Healthcare Platform': ['patient', 'doctor', 'medical', 'health', 'hospital', 'clinic'],
            'Financial Platform': ['finance', 'money', 'budget', 'expense', 'accounting', 'transaction'],
            'Travel Platform': ['travel', 'trip', 'hotel', 'flight', 'booking', 'destination'],
            'Recipe Platform': ['recipe', 'cooking', 'ingredient', 'meal', 'food', 'kitchen']
        };

        // Find the best matching app type
        let appName = 'Application Platform';
        let maxScore = 0;

        for (const [type, keywords] of Object.entries(appTypes)) {
            const score = keywords.filter(keyword => text.includes(keyword)).length;
            if (score > maxScore) {
                maxScore = score;
                appName = type;
            }
        }

        // Generate entities based on app type and description
        const entities = this.generateEntitiesForAppType(appName, text);

        // Generate roles based on app type and description
        const roles = this.generateRolesForAppType(appName, text);

        // Generate features based on app type and description
        const features = this.generateFeaturesForAppType(appName, text);

        return {
            appName,
            entities: [...new Set(entities)].slice(0, 8),
            roles: [...new Set(roles)].slice(0, 6),
            features: [...new Set(features)].slice(0, 10)
        };
    }

    generateEntitiesForAppType(appName, text) {
        const entityMap = {
            'Forum Platform': ['User', 'Post', 'Comment', 'Category', 'Thread', 'Tag'],
            'E-commerce Platform': ['Product', 'Order', 'Customer', 'Category', 'Cart', 'Payment', 'Review'],
            'Social Media Platform': ['User', 'Post', 'Comment', 'Like', 'Follow', 'Message', 'Photo'],
            'Gaming Platform': ['Player', 'Game', 'Score', 'Level', 'Achievement', 'Match'],
            'Blog Platform': ['Post', 'Author', 'Comment', 'Category', 'Tag', 'Reader'],
            'Learning Management System': ['Student', 'Teacher', 'Course', 'Assignment', 'Grade', 'Lesson'],
            'Task Management System': ['Task', 'User', 'Project', 'Team', 'Assignment', 'Status'],
            'Chat Application': ['User', 'Message', 'Conversation', 'Group', 'Channel'],
            'Music Platform': ['Song', 'Artist', 'Album', 'Playlist', 'User', 'Genre'],
            'Video Platform': ['Video', 'Channel', 'User', 'Comment', 'Playlist', 'Category'],
            'Dating Platform': ['Profile', 'Match', 'Message', 'Photo', 'Preference'],
            'Food Delivery Platform': ['Restaurant', 'Menu', 'Order', 'Customer', 'Delivery', 'Review'],
            'Real Estate Platform': ['Property', 'Agent', 'Client', 'Listing', 'Location', 'Photo'],
            'Fitness Platform': ['User', 'Workout', 'Exercise', 'Goal', 'Progress', 'Trainer'],
            'News Platform': ['Article', 'Author', 'Category', 'Comment', 'Reader', 'Tag'],
            'Event Management System': ['Event', 'Ticket', 'Venue', 'Organizer', 'Attendee'],
            'Inventory Management System': ['Product', 'Stock', 'Supplier', 'Order', 'Category'],
            'CRM Platform': ['Customer', 'Lead', 'Deal', 'Contact', 'Activity', 'Sales'],
            'Healthcare Platform': ['Patient', 'Doctor', 'Appointment', 'Medical Record', 'Treatment'],
            'Financial Platform': ['Account', 'Transaction', 'Budget', 'Category', 'User', 'Report'],
            'Travel Platform': ['Trip', 'Hotel', 'Flight', 'Booking', 'Traveler', 'Review'],
            'Recipe Platform': ['Recipe', 'Ingredient', 'User', 'Category', 'Review', 'Photo']
        };

        return entityMap[appName] || ['User', 'Item', 'Category', 'Tag'];
    }

    generateRolesForAppType(appName, text) {
        const roleMap = {
            'Forum Platform': ['Admin', 'Moderator', 'Member', 'Guest'],
            'E-commerce Platform': ['Admin', 'Seller', 'Customer', 'Support'],
            'Social Media Platform': ['User', 'Influencer', 'Moderator', 'Admin'],
            'Gaming Platform': ['Player', 'Admin', 'Spectator', 'Tournament Organizer'],
            'Blog Platform': ['Author', 'Reader', 'Editor', 'Admin'],
            'Learning Management System': ['Teacher', 'Student', 'Admin', 'Parent'],
            'Task Management System': ['Manager', 'Team Member', 'Client', 'Admin'],
            'Chat Application': ['User', 'Moderator', 'Admin', 'Bot'],
            'Music Platform': ['Listener', 'Artist', 'Admin', 'Curator'],
            'Video Platform': ['Creator', 'Viewer', 'Moderator', 'Admin'],
            'Dating Platform': ['User', 'Premium User', 'Moderator', 'Admin'],
            'Food Delivery Platform': ['Customer', 'Restaurant Owner', 'Delivery Driver', 'Admin'],
            'Real Estate Platform': ['Agent', 'Buyer', 'Seller', 'Admin'],
            'Fitness Platform': ['User', 'Trainer', 'Nutritionist', 'Admin'],
            'News Platform': ['Reader', 'Journalist', 'Editor', 'Admin'],
            'Event Management System': ['Organizer', 'Attendee', 'Vendor', 'Admin'],
            'Inventory Management System': ['Manager', 'Staff', 'Supplier', 'Admin'],
            'CRM Platform': ['Sales Rep', 'Manager', 'Customer', 'Admin'],
            'Healthcare Platform': ['Doctor', 'Patient', 'Nurse', 'Admin'],
            'Financial Platform': ['User', 'Advisor', 'Admin', 'Auditor'],
            'Travel Platform': ['Traveler', 'Agent', 'Hotel Manager', 'Admin'],
            'Recipe Platform': ['Cook', 'Reader', 'Chef', 'Admin']
        };

        return roleMap[appName] || ['Admin', 'User', 'Guest'];
    }

    generateFeaturesForAppType(appName, text) {
        const featureMap = {
            'Forum Platform': ['Create Post', 'Reply to Posts', 'Moderate Content', 'Search Posts', 'User Profiles', 'Vote on Posts'],
            'E-commerce Platform': ['Browse Products', 'Add to Cart', 'Checkout', 'Manage Orders', 'Product Reviews', 'Payment Processing'],
            'Social Media Platform': ['Create Post', 'Like Content', 'Follow Users', 'Share Content', 'Direct Messages', 'Story Feature'],
            'Gaming Platform': ['Start Game', 'Save Progress', 'Leaderboard', 'Multiplayer Mode', 'Achievements', 'Game History'],
            'Blog Platform': ['Write Posts', 'Comment System', 'Category Management', 'SEO Tools', 'User Subscriptions'],
            'Learning Management System': ['Create Courses', 'Submit Assignments', 'Grade Students', 'Track Progress', 'Online Quizzes'],
            'Task Management System': ['Create Tasks', 'Assign Tasks', 'Track Progress', 'Team Collaboration', 'Deadline Management'],
            'Chat Application': ['Send Messages', 'Group Chats', 'File Sharing', 'Video Calls', 'Message History'],
            'Music Platform': ['Play Music', 'Create Playlists', 'Discover Music', 'Download Songs', 'Artist Profiles'],
            'Video Platform': ['Upload Videos', 'Watch Videos', 'Subscribe to Channels', 'Comment System', 'Video Recommendations'],
            'Dating Platform': ['Create Profile', 'Browse Profiles', 'Send Messages', 'Match System', 'Privacy Settings'],
            'Food Delivery Platform': ['Browse Restaurants', 'Place Orders', 'Track Delivery', 'Rate Food', 'Payment Integration'],
            'Real Estate Platform': ['List Properties', 'Search Properties', 'Schedule Viewings', 'Contact Agents', 'Property Photos'],
            'Fitness Platform': ['Track Workouts', 'Set Goals', 'Progress Analytics', 'Social Features', 'Exercise Library'],
            'News Platform': ['Read Articles', 'Comment on News', 'Share Articles', 'Breaking News Alerts', 'Category Filters'],
            'Event Management System': ['Create Events', 'Book Tickets', 'Manage Attendees', 'Send Invitations', 'Event Calendar'],
            'Inventory Management System': ['Track Stock', 'Manage Suppliers', 'Generate Reports', 'Order Management', 'Stock Alerts'],
            'CRM Platform': ['Manage Contacts', 'Track Leads', 'Sales Pipeline', 'Customer History', 'Report Generation'],
            'Healthcare Platform': ['Book Appointments', 'Medical Records', 'Prescription Management', 'Doctor Consultation'],
            'Financial Platform': ['Track Expenses', 'Budget Planning', 'Investment Tracking', 'Bill Reminders', 'Financial Reports'],
            'Travel Platform': ['Search Flights', 'Book Hotels', 'Trip Planning', 'Travel Reviews', 'Itinerary Management'],
            'Recipe Platform': ['Search Recipes', 'Save Favorites', 'Meal Planning', 'Shopping Lists', 'Recipe Reviews']
        };

        return featureMap[appName] || ['Create Records', 'View Data', 'Search Content', 'User Management', 'Settings'];
    }

    // Main extraction method - tries OpenAI first, falls back to intelligent extraction
    async extractRequirements(description) {
        const startTime = Date.now();

        try {
            // Try OpenAI first if API key is available
            if (this.openaiApiKey && this.openaiApiKey !== 'sk-your-actual-openai-api-key-here') {
                console.log('🤖 Using OpenAI GPT for requirement extraction');
                const result = await this.extractWithOpenAI(description);

                return {
                    ...result,
                    metadata: {
                        extractedAt: new Date().toISOString(),
                        processingTime: Date.now() - startTime,
                        model: 'openai-gpt-3.5-turbo',
                        confidence: 0.95
                    }
                };
            }

            // Fallback to intelligent extraction
            console.log('🔧 OpenAI not configured, using intelligent fallback extraction');
            const result = this.intelligentFallbackExtraction(description);

            return {
                ...result,
                metadata: {
                    extractedAt: new Date().toISOString(),
                    processingTime: Date.now() - startTime,
                    model: 'intelligent-fallback',
                    confidence: 0.8
                }
            };

        } catch (error) {
            console.error('AI Service Error:', error.message);

            // Ultimate fallback - still provide a reasonable response
            console.log('⚠️ Falling back to basic extraction due to error');
            const result = this.intelligentFallbackExtraction(description);

            return {
                ...result,
                metadata: {
                    extractedAt: new Date().toISOString(),
                    processingTime: Date.now() - startTime,
                    model: 'fallback-basic',
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
        const hasValidOpenAI = this.openaiApiKey &&
            this.openaiApiKey !== 'your_openai_api_key_here' &&
            this.openaiApiKey !== 'sk-your-actual-openai-api-key-here';

        return {
            openaiConfigured: hasValidOpenAI,
            fallbackAvailable: true,
            recommended: hasValidOpenAI ? 'openai' : 'intelligent-fallback',
            status: hasValidOpenAI ? 'ready' : 'fallback-mode'
        };
    }
}

module.exports = new AIService();