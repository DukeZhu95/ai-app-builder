import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader, Sparkles } from 'lucide-react';
import axios from 'axios';

const RequirementCapture = ({ onRequirementsGenerated }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [extractedRequirements, setExtractedRequirements] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        setLoading(true);
        try {
            // Call real backend API to extract requirements
            const response = await axios.post('http://localhost:5000/api/extract-requirements', {
                description: description.trim()
            });

            const requirements = response.data;

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