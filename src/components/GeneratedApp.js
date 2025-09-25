import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Database, Settings, Plus, Eye, Save, Check } from 'lucide-react';
import axios from 'axios';
import '../styles/GeneratedApp.css';

const GeneratedApp = ({ requirements }) => {
    const [activeTab, setActiveTab] = useState(requirements.roles[0] || 'Main');
    const [activeEntity, setActiveEntity] = useState(requirements.entities[0] || '');
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    // Hide the main portal header when component mounts
    useEffect(() => {
        const mainHeader = document.querySelector('.App .app-header');
        if (mainHeader) {
            mainHeader.style.display = 'none';
        }

        // 清理函数
        return () => {
            const mainHeader = document.querySelector('.App .app-header');
            if (mainHeader) {
                mainHeader.style.display = 'block';
            }
        };
    }, []);

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
            'Product': [
                { name: 'name', type: 'text', label: 'Name', placeholder: 'Product name' },
                { name: 'price', type: 'number', label: 'Price', placeholder: '0.00' },
                { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Product description' },
                { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Inactive', 'Out of Stock'] }
            ],
            'Order': [
                { name: 'orderNumber', type: 'text', label: 'Order #', placeholder: 'ORD001' },
                { name: 'customer', type: 'text', label: 'Customer', placeholder: 'Customer name' },
                { name: 'total', type: 'number', label: 'Total', placeholder: '0.00' },
                { name: 'status', type: 'select', label: 'Status', options: ['Pending', 'Processing', 'Shipped', 'Delivered'] }
            ],
            'Customer': [
                { name: 'name', type: 'text', label: 'Name', placeholder: 'Customer name' },
                { name: 'email', type: 'email', label: 'Email', placeholder: 'email@example.com' },
                { name: 'phone', type: 'tel', label: 'Phone', placeholder: '+1234567890' },
                { name: 'address', type: 'textarea', label: 'Address', placeholder: 'Address' }
            ],
            'User': [
                { name: 'name', type: 'text', label: 'Name', placeholder: 'Full name' },
                { name: 'email', type: 'email', label: 'Email', placeholder: 'email@example.com' },
                { name: 'role', type: 'select', label: 'Role', options: requirements.roles },
                { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Inactive'] }
            ],
            'Inventory': [
                { name: 'itemName', type: 'text', label: 'Item Name', placeholder: 'Item name' },
                { name: 'quantity', type: 'number', label: 'Quantity', placeholder: '0' },
                { name: 'location', type: 'text', label: 'Location', placeholder: 'Storage location' },
                { name: 'status', type: 'select', label: 'Status', options: ['In Stock', 'Low Stock', 'Out of Stock'] }
            ],
            'Seller': [
                { name: 'name', type: 'text', label: 'Seller Name', placeholder: 'Business name' },
                { name: 'email', type: 'email', label: 'Email', placeholder: 'seller@example.com' },
                { name: 'phone', type: 'tel', label: 'Phone', placeholder: '+1234567890' },
                { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Pending', 'Suspended'] }
            ]
        };

        return fieldMappings[entityName] || [
            { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
            { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Enter description' },
            { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Inactive'] }
        ];
    };

    // Generate role-specific features (compact version)
    const generateRoleFeatures = (role) => {
        const roleFeatureMappings = {
            'Admin': [
                { name: 'View Data', icon: Eye, color: 'blue', description: 'Browse system data' },
                { name: 'Create Entry', icon: Plus, color: 'green', description: 'Add new entries' },
                { name: 'Settings', icon: Settings, color: 'gray', description: 'Access settings' }
            ],
            'Customer': [
                { name: 'Browse Products', icon: Eye, color: 'blue', description: 'View available products' },
                { name: 'Place Order', icon: Plus, color: 'green', description: 'Create new orders' },
                { name: 'Order History', icon: Database, color: 'gray', description: 'View past orders' }
            ],
            'Seller': [
                { name: 'Manage Products', icon: Database, color: 'blue', description: 'Handle product catalog' },
                { name: 'Process Orders', icon: Settings, color: 'green', description: 'Fulfill orders' },
                { name: 'Sales Reports', icon: Eye, color: 'gray', description: 'View analytics' }
            ],
            'Teacher': [
                { name: 'Manage Courses', icon: Database, color: 'blue', description: 'Create and edit courses' },
                { name: 'Grade Students', icon: Settings, color: 'green', description: 'Assess student work' },
                { name: 'View Reports', icon: Eye, color: 'gray', description: 'Student progress reports' }
            ],
            'Student': [
                { name: 'View Courses', icon: Eye, color: 'blue', description: 'Browse available courses' },
                { name: 'Enroll', icon: Plus, color: 'green', description: 'Join new courses' },
                { name: 'Track Progress', icon: Database, color: 'gray', description: 'Monitor learning' }
            ],
            'Manager': [
                { name: 'View Reports', icon: Eye, color: 'blue', description: 'Business analytics' },
                { name: 'Manage Staff', icon: Settings, color: 'green', description: 'Team management' },
                { name: 'System Settings', icon: Database, color: 'gray', description: 'Configure system' }
            ]
        };

        return roleFeatureMappings[role] || [
            { name: 'View Data', icon: Eye, color: 'blue', description: 'Browse data' },
            { name: 'Create Entry', icon: Plus, color: 'green', description: 'Add entries' },
            { name: 'Settings', icon: Settings, color: 'gray', description: 'Settings' }
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
        alert(`${activeEntity} data saved successfully! (Demo)`);
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
                        rows={2}
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
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
        }}>
            <div className="generated-app" style={{
                height: '100%',
                margin: 0,
                overflow: 'hidden'
            }}>
                {/* Custom Header for Generated App */}
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

                {/* Optimized Dashboard Layout */}
                <div className="dashboard-container">
                    {/* Compact Left Sidebar */}
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

                        {/* Compact App Specifications */}
                        <div className="sidebar-section app-specifications">
                            <h3>App Specifications</h3>

                            <div className="spec-card">
                                <h4>Application</h4>
                                <div className="app-name">{requirements.appName}</div>
                            </div>

                            <div className="spec-card">
                                <h4>Entities ({requirements.entities.length})</h4>
                                <div className="badge-group">
                                    {requirements.entities.map((entity, index) => (
                                        <span key={index} className="badge entity-badge">
                                            {entity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="spec-card">
                                <h4>User Roles ({requirements.roles.length})</h4>
                                <div className="badge-group">
                                    {requirements.roles.map((role, index) => (
                                        <span key={index} className="badge role-badge">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="spec-card">
                                <h4>Features ({requirements.features.length})</h4>
                                <ul className="feature-list">
                                    {requirements.features.slice(0, 6).map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                    {requirements.features.length > 6 && (
                                        <li>+{requirements.features.length - 6} more...</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area - No Scroll */}
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
        </div>
    );
};

export default GeneratedApp;