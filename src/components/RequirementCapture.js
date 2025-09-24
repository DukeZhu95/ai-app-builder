import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader, Sparkles } from 'lucide-react';
import axios from 'axios';

const RequirementCapture = ({ onRequirementsGenerated }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) return;

        // 输入验证
        if (description.trim().length < 20) {
            setError('Please provide a more detailed description (at least 20 characters)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Sending request to extract requirements...');

            // 使用正确的端点
            const response = await axios.post('http://localhost:5000/api/extract-requirements', {
                description: description.trim()
            }, {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('API Response:', response.data);

            // 后端直接返回需求数据，不需要 .requirements 嵌套
            if (response.data && response.data.appName) {
                const requirements = {
                    appName: response.data.appName,
                    entities: response.data.entities || [],
                    roles: response.data.roles || [],
                    features: response.data.features || [],
                    metadata: {
                        ...response.data.metadata,
                        originalDescription: description.trim(),
                        timestamp: new Date().toISOString()
                    }
                };

                console.log('Generated requirements:', requirements);

                // 直接传递给父组件并跳转，不显示中间结果
                onRequirementsGenerated(requirements);

                // 短暂延迟后跳转，让用户看到成功状态
                setTimeout(() => {
                    navigate('/generated-app');
                }, 800);

            } else {
                throw new Error('Invalid response format from server');
            }

        } catch (error) {
            console.error('Error extracting requirements:', error);

            let errorMessage = 'Failed to extract requirements. ';

            if (error.code === 'ECONNABORTED') {
                errorMessage += 'Request timed out. Please try again.';
            } else if (error.response) {
                const status = error.response.status;
                const serverMessage = error.response.data?.error || error.response.data?.message;

                if (status === 500) {
                    errorMessage += serverMessage || 'Server error. Please try again later.';
                } else if (status === 400) {
                    errorMessage += serverMessage || 'Invalid request. Please check your input.';
                } else if (status === 429) {
                    errorMessage += 'Too many requests. Please wait a moment and try again.';
                } else {
                    errorMessage += `Server error (${status}). Please try again.`;
                }
            } else if (error.request) {
                errorMessage += 'No response from server. Please check your internet connection.';
            } else {
                errorMessage += error.message || 'Unknown error occurred.';
            }

            setError(errorMessage);
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
        if (!loading) {
            setDescription(example);
            setError(''); // 清除之前的错误
        }
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
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setError(''); // 清除错误当用户修改输入时
                            }}
                            placeholder="Describe your app idea in detail..."
                            rows={6}
                            className="description-input"
                            disabled={loading}
                            maxLength={2000}
                        />
                        <div className="char-count">
                            {description.length} characters
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

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
        </div>
    );
};

export default RequirementCapture;