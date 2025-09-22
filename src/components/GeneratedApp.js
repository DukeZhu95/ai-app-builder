import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Database, Settings, Plus, Edit, Trash2, Eye, Save, Check } from 'lucide-react';
import axios from 'axios';

const GeneratedApp = ({ requirements }) => {
    const [activeTab, setActiveTab] = useState(requirements.roles[0] || 'Main');
    const [activeEntity, setActiveEntity] = useState(requirements.entities[0] || '');
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    // Save app to database
    const handleSaveApp = async () => {
        setIsSaving(true);
        try {
            const response = await axios.post('http://localhost:5000/api/save-app', {
                appName: requirements.appName,
                entities: requirements.entities,
                roles: requirements.roles,
                features: requirements.features,
                description: requirements.metadata?.originalDescription || 'AI Generated Application'
            });

            console.log('App saved successfully:', response.data);
            setIsSaved(true);

            setTimeout(() => setIsSaved(false), 3000);

        } catch (error) {
            console.error('Error saving app:', error);
            alert('Failed to save app. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Generate appropriate form fields for each entity
    const generateEntityFields = (entityName) => {
        const fieldMappings = {
            'Student': [
                { name: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter student name' },
                { name: 'email', type: 'email', label: 'Email Address', placeholder: 'student@example.com' },
                { name: 'studentId', type: 'text', label: 'Student ID', placeholder: 'STU001' },
                { name: 'age', type: 'number', label: 'Age', placeholder: '18' }
            ],
            'Post': [
                { name: 'title', type: 'text', label: 'Post Title', placeholder: 'Enter post title' },
                { name: 'content', type: 'textarea', label: 'Content', placeholder: 'Write your post content...' },
                { name: 'category', type: 'select', label: 'Category', options: ['Technology', 'Lifestyle', 'Business', 'Education'] },
                { name: 'status', type: 'select', label: 'Status', options: ['Draft', 'Published', 'Archived'] }
            ],
            'User': [
                { name: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter full name' },
                { name: 'email', type: 'email', label: 'Email Address', placeholder: 'user@example.com' },
                { name: 'role', type: 'select', label: 'Role', options: requirements.roles },
                { name: 'phone', type: 'tel', label: 'Phone Number', placeholder: '+1234567890' }
            ],
            'Comment': [
                { name: 'author', type: 'text', label: 'Author', placeholder: 'Comment author' },
                { name: 'content', type: 'textarea', label: 'Comment', placeholder: 'Write your comment...' },
                { name: 'status', type: 'select', label: 'Status', options: ['Approved', 'Pending', 'Rejected'] }
            ]
        };

        return fieldMappings[entityName] || [
            { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
            { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Enter description' },
            { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Inactive'] }
        ];
    };

    // Generate role-specific features and actions
    const generateRoleFeatures = (role) => {
        const roleFeatureMappings = {
            'Writer': [
                { name: 'Create Post', icon: Plus, color: 'blue', description: 'Write and publish new posts' },
                { name: 'Edit Posts', icon: Edit, color: 'green', description: 'Modify existing content' },
                { name: 'View Analytics', icon: Eye, color: 'purple', description: 'Track post performance' }
            ],
            'Moderator': [
                { name: 'Manage Content', icon: Database, color: 'blue', description: 'Oversee all content' },
                { name: 'Review Comments', icon: Eye, color: 'orange', description: 'Moderate user comments' },
                { name: 'User Management', icon: User, color: 'red', description: 'Manage user accounts' }
            ],
            'Reader': [
                { name: 'Browse Posts', icon: Eye, color: 'blue', description: 'Explore published content' },
                { name: 'Comment', icon: Plus, color: 'green', description: 'Engage with posts' },
                { name: 'Save Favorites', icon: Database, color: 'purple', description: 'Bookmark content' }
            ],
            'User': [
                { name: 'View Content', icon: Eye, color: 'blue', description: 'Browse available content' },
                { name: 'Create Entry', icon: Plus, color: 'green', description: 'Add new entries' },
                { name: 'Profile Settings', icon: Settings, color: 'gray', description: 'Manage account' }
            ]
        };

        return roleFeatureMappings[role] || [
            { name: 'View Data', icon: Eye, color: 'blue', description: 'Browse system data' },
            { name: 'Create Entry', icon: Plus, color: 'green', description: 'Add new entries' },
            { name: 'Settings', icon: Settings, color: 'gray', description: 'Access settings' }
        ];
    };

    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert(`${activeEntity} data saved successfully! (This is a demo)`);
        setFormData({});
    };

    const renderFormField = (field) => {
        const { name, type, label, placeholder, options } = field;
        const value = formData[name] || '';

        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={placeholder}
                        className="form-input textarea"
                        rows={3}
                    />
                );
            case 'select':
                return (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        className="form-input select"
                    >
                        <option value="">Select {label}</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                );
            default:
                return (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                        placeholder={placeholder}
                        className="form-input"
                    />
                );
        }
    };

    return (
        <div className="generated-app">
            {/* Top Header */}
            <div className="app-header">
                <div className="header-left">
                    <button onClick={() => navigate('/')} className="back-button">
                        <ArrowLeft className="icon" />
                        Back to Builder
                    </button>
                </div>
                <div className="header-content">
                    <h1>{requirements.appName}</h1>
                    <p>Your AI-Generated Application Interface</p>
                </div>
                <div className="header-right">
                    <button
                        onClick={handleSaveApp}
                        className={`save-button ${isSaved ? 'saved' : ''}`}
                        disabled={isSaving || isSaved}
                    >
                        {isSaved ? (
                            <>
                                <Check className="icon" />
                                Saved!
                            </>
                        ) : isSaving ? (
                            <>
                                <Save className="icon spinning" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="icon" />
                                Save App
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Dashboard Layout */}
            <div className="dashboard-container">
                {/* Left Sidebar - Compact Role Navigation + App Specs */}
                <div className="sidebar">
                    <div className="sidebar-section">
                        <h3>User Roles</h3>
                        <div className="role-buttons">
                            {requirements.roles.map((role, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(role)}
                                    className={`role-button ${activeTab === role ? 'active' : ''}`}
                                >
                                    <User className="icon" />
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Data Management</h3>
                        <div className="entity-buttons">
                            {requirements.entities.map((entity, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveEntity(entity)}
                                    className={`entity-button ${activeEntity === entity ? 'active' : ''}`}
                                >
                                    <Database className="icon" />
                                    {entity}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* App Specifications moved to left sidebar */}
                    <div className="sidebar-section app-specs-sidebar">
                        <h3>App Specifications</h3>

                        <div className="spec-item">
                            <strong>Application:</strong>
                            <span className="app-name">{requirements.appName}</span>
                        </div>

                        <div className="spec-item">
                            <strong>Entities ({requirements.entities.length}):</strong>
                            <div className="badge-group">
                                {requirements.entities.map((entity, index) => (
                                    <span key={index} className="badge entity-badge">
                                        {entity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="spec-item">
                            <strong>User Roles ({requirements.roles.length}):</strong>
                            <div className="badge-group">
                                {requirements.roles.map((role, index) => (
                                    <span key={index} className="badge role-badge">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="spec-item">
                            <strong>Key Features ({requirements.features.length}):</strong>
                            <ul className="feature-list">
                                {requirements.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content Area - Now takes full remaining width */}
                <div className="main-content">
                    {/* Role Dashboard */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>{activeTab} Dashboard</h2>
                            <p>Available actions and features</p>
                        </div>

                        <div className="feature-cards">
                            {generateRoleFeatures(activeTab).map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className={`feature-card ${feature.color}`}>
                                        <div className="feature-icon-wrapper">
                                            <IconComponent className="feature-icon" />
                                        </div>
                                        <div className="feature-info">
                                            <h4>{feature.name}</h4>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Entity Form Section */}
                    {activeEntity && (
                        <div className="form-section">
                            <div className="section-header">
                                <h2>Add New {activeEntity}</h2>
                                <p>Fill in the details to create a new {activeEntity.toLowerCase()}</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="entity-form-modern">
                                <div className="form-fields">
                                    {generateEntityFields(activeEntity).map((field, index) => (
                                        <div key={index} className="form-group">
                                            <label className="form-label">{field.label}</label>
                                            {renderFormField(field)}
                                        </div>
                                    ))}
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        <Plus className="icon" />
                                        Add {activeEntity}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setFormData({})}
                                    >
                                        Clear Form
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneratedApp;