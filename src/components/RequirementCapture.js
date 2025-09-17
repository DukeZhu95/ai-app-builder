import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader, Sparkles } from 'lucide-react';
import axios from 'axios';

const RequirementCapture = ({ onRequirementsGenerated }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [extractedRequirements, setExtractedRequirements] = useState(null);
    const navigate = useNavigate();

    // Mock AI extraction function (for now, until we set up the backend)
    const mockAIExtraction = (description) => {
        const text = description.toLowerCase();

        // Extract app name
        let appName = 'Generated App';
        if (text.includes('course') || text.includes('grade')) {
            appName = 'Course Management System';
        } else if (text.includes('shop') || text.includes('store') || text.includes('product')) {
            appName = 'E-commerce Platform';
        } else if (text.includes('task') || text.includes('project')) {
            appName = 'Task Management System';
        } else if (text.includes('blog') || text.includes('post')) {
            appName = 'Blog Platform';
        } else if (text.includes('inventory')) {
            appName = 'Inventory Management';
        }

        // Extract entities
        const entities = [];
        const entityKeywords = {
            'Student': ['student', 'pupil', 'learner'],
            'Teacher': ['teacher', 'instructor', 'professor'],
            'Course': ['course', 'class', 'subject'],
            'Grade': ['grade', 'score', 'mark'],
            'User': ['user', 'person', 'people'],
            'Product': ['product', 'item', 'goods'],
            'Order': ['order', 'purchase', 'transaction'],
            'Customer': ['customer', 'client', 'buyer'],
            'Task': ['task', 'assignment', 'job'],
            'Project': ['project', 'initiative'],
            'Post': ['post', 'article', 'blog'],
            'Comment': ['comment', 'review', 'feedback'],
            'Admin': ['admin', 'administrator', 'manager']
        };

        Object.keys(entityKeywords).forEach(entity => {
            if (entityKeywords[entity].some(keyword => text.includes(keyword))) {
                entities.push(entity);
            }
        });

        if (entities.length === 0) {
            entities.push('User', 'Item', 'Category');
        }

        // Extract roles
        const roles = [];
        const roleKeywords = {
            'Admin': ['admin', 'administrator', 'manager'],
            'Teacher': ['teacher', 'instructor', 'professor'],
            'Student': ['student', 'pupil', 'learner'],
            'Customer': ['customer', 'client', 'buyer'],
            'Seller': ['seller', 'vendor', 'merchant'],
            'User': ['user', 'member']
        };

        Object.keys(roleKeywords).forEach(role => {
            if (roleKeywords[role].some(keyword => text.includes(keyword))) {
                roles.push(role);
            }
        });

        if (roles.length === 0) {
            roles.push('Admin', 'User');
        }

        // Extract features
        const features = [];
        const featureKeywords = {
            'Create Records': ['add', 'create', 'register', 'enroll'],
            'View Reports': ['report', 'analytics', 'dashboard'],
            'Manage Users': ['manage', 'edit', 'update', 'delete'],
            'Upload Files': ['upload', 'file', 'document'],
            'Send Messages': ['message', 'chat', 'communicate'],
            'Track Progress': ['track', 'progress', 'monitor'],
            'Generate Invoices': ['invoice', 'bill', 'payment'],
            'Search Data': ['search', 'find', 'filter'],
            'Export Data': ['export', 'download', 'backup']
        };

        Object.keys(featureKeywords).forEach(feature => {
            if (featureKeywords[feature].some(keyword => text.includes(keyword))) {
                features.push(feature);
            }
        });

        if (features.length === 0) {
            features.push('Create Records', 'View Data', 'Manage Settings');
        }

        return {
            appName,
            entities: [...new Set(entities)],
            roles: [...new Set(roles)],
            features: [...new Set(features)]
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        setLoading(true);
        try {
            // For now, use mock AI extraction
            // Later we'll replace this with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

            const requirements = mockAIExtraction(description);

            /*
            // This is how we'll call the real API later:
            const response = await axios.post('http://localhost:5000/api/extract-requirements', {
              description: description.trim()
            });
            const requirements = response.data;
            */

            setExtractedRequirements(requirements);
            onRequirementsGenerated(requirements);

            // Navigate to generated app after showing the results
            setTimeout(() => {
                navigate('/generated-app');
            }, 3000);

        } catch (error) {
            console.error('Error extracting requirements:', error);
            alert('Failed to extract requirements. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const examplePrompts = [
        "I want an app to manage student courses and grades. Teachers add courses, students enroll, and admins manage reports.",
        "Create an e-commerce platform where customers can browse products, place orders, and sellers can manage inventory.",
        "Build a task management system where team members can create tasks, assign them to others, and track progress.",
        "Design a blog platform where writers can publish posts, readers can comment, and moderators can manage content."
    ];

    const selectExample = (example) => {
        setDescription(example);
    };

    return (
        <div className="requirement-capture">
            <div className="capture-form">
                <div className="form-header">
                    <Sparkles className="header-icon" />
                    <h2>Describe Your Dream App</h2>
                    <p>Tell us what you want to build, and our AI will analyze your requirements and generate a custom interface!</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="description">App Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your app idea in detail..."
                            rows={6}
                            className="description-input"
                            disabled={loading}
                        />
                        <div className="char-count">
                            {description.length} characters
                        </div>
                    </div>

                    <div className="example-prompts">
                        <h4>Need inspiration? Try these examples:</h4>
                        <div className="examples-grid">
                            {examplePrompts.map((example, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="example-btn"
                                    onClick={() => selectExample(example)}
                                    disabled={loading}
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading || !description.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader className="icon spinning" />
                                AI is analyzing your requirements...
                            </>
                        ) : (
                            <>
                                <Send className="icon" />
                                Generate My App
                            </>
                        )}
                    </button>
                </form>
            </div>

            {extractedRequirements && (
                <div className="extracted-requirements">
                    <div className="requirements-header">
                        <Sparkles className="icon" />
                        <h3>AI Extracted Requirements</h3>
                    </div>
                    <div className="requirements-display">
                        <div className="requirement-item">
                            <strong>📱 App Name:</strong>
                            <span className="highlight">{extractedRequirements.appName}</span>
                        </div>
                        <div className="requirement-item">
                            <strong>🗃️ Entities ({extractedRequirements.entities.length}):</strong>
                            <div className="tags">
                                {extractedRequirements.entities.map((entity, index) => (
                                    <span key={index} className="tag entity-tag">{entity}</span>
                                ))}
                            </div>
                        </div>
                        <div className="requirement-item">
                            <strong>👥 Roles ({extractedRequirements.roles.length}):</strong>
                            <div className="tags">
                                {extractedRequirements.roles.map((role, index) => (
                                    <span key={index} className="tag role-tag">{role}</span>
                                ))}
                            </div>
                        </div>
                        <div className="requirement-item">
                            <strong>⚡ Features ({extractedRequirements.features.length}):</strong>
                            <div className="tags">
                                {extractedRequirements.features.map((feature, index) => (
                                    <span key={index} className="tag feature-tag">{feature}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="redirect-message">
                        <Loader className="icon spinning" />
                        Generating your custom app interface...
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequirementCapture;