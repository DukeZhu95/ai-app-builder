import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Database, Settings, Plus, Edit, Trash2, Eye } from 'lucide-react';

const GeneratedApp = ({ requirements }) => {
    const [activeTab, setActiveTab] = useState(requirements.roles[0] || 'Main');
    const [activeEntity, setActiveEntity] = useState(requirements.entities[0] || '');
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Generate appropriate form fields for each entity
    const generateEntityFields = (entityName) => {
        const fieldMappings = {
            'Student': [
                { name: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter student name' },
                { name: 'email', type: 'email', label: 'Email Address', placeholder: 'student@example.com' },
                { name: 'studentId', type: 'text', label: 'Student ID', placeholder: 'STU001' },
                { name: 'age', type: 'number', label: 'Age', placeholder: '18' },
                { name: 'major', type: 'text', label: 'Major', placeholder: 'Computer Science' }
            ],
            'Teacher': [
                { name: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter teacher name' },
                { name: 'email', type: 'email', label: 'Email Address', placeholder: 'teacher@example.com' },
                { name: 'teacherId', type: 'text', label: 'Teacher ID', placeholder: 'TEA001' },
                { name: 'department', type: 'text', label: 'Department', placeholder: 'Computer Science' },
                { name: 'experience', type: 'number', label: 'Years of Experience', placeholder: '5' }
            ],
            'Course': [
                { name: 'title', type: 'text', label: 'Course Title', placeholder: 'Introduction to Programming' },
                { name: 'code', type: 'text', label: 'Course Code', placeholder: 'CS101' },
                { name: 'credits', type: 'number', label: 'Credits', placeholder: '3' },
                { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Course description...' },
                { name: 'instructor', type: 'text', label: 'Instructor', placeholder: 'Dr. Smith' }
            ],
            'Grade': [
                { name: 'student', type: 'text', label: 'Student Name', placeholder: 'John Doe' },
                { name: 'course', type: 'text', label: 'Course', placeholder: 'CS101' },
                { name: 'grade', type: 'text', label: 'Grade', placeholder: 'A' },
                { name: 'semester', type: 'text', label: 'Semester', placeholder: 'Fall 2024' },
                { name: 'points', type: 'number', label: 'Points', placeholder: '95' }
            ],
            'Product': [
                { name: 'name', type: 'text', label: 'Product Name', placeholder: 'Enter product name' },
                { name: 'price', type: 'number', label: 'Price ($)', placeholder: '99.99' },
                { name: 'category', type: 'text', label: 'Category', placeholder: 'Electronics' },
                { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Product description...' },
                { name: 'stock', type: 'number', label: 'Stock Quantity', placeholder: '50' }
            ],
            'Order': [
                { name: 'orderId', type: 'text', label: 'Order ID', placeholder: 'ORD001' },
                { name: 'customer', type: 'text', label: 'Customer Name', placeholder: 'John Doe' },
                { name: 'total', type: 'number', label: 'Total Amount ($)', placeholder: '299.99' },
                { name: 'status', type: 'select', label: 'Status', options: ['Pending', 'Processing', 'Shipped', 'Delivered'] },
                { name: 'date', type: 'date', label: 'Order Date' }
            ],
            'Task': [
                { name: 'title', type: 'text', label: 'Task Title', placeholder: 'Complete project proposal' },
                { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Task description...' },
                { name: 'assignee', type: 'text', label: 'Assigned To', placeholder: 'John Doe' },
                { name: 'priority', type: 'select', label: 'Priority', options: ['Low', 'Medium', 'High', 'Urgent'] },
                { name: 'dueDate', type: 'date', label: 'Due Date' }
            ],
            'User': [
                { name: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter full name' },
                { name: 'email', type: 'email', label: 'Email Address', placeholder: 'user@example.com' },
                { name: 'role', type: 'select', label: 'Role', options: requirements.roles },
                { name: 'phone', type: 'tel', label: 'Phone Number', placeholder: '+1234567890' },
                { name: 'joinDate', type: 'date', label: 'Join Date' }
            ]
        };

        return fieldMappings[entityName] || [
            { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
            { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Enter description' },
            { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Inactive'] },
            { name: 'createdAt', type: 'date', label: 'Created Date' }
        ];
    };

    // Generate role-specific features and actions
    const generateRoleFeatures = (role) => {
        const roleFeatureMappings = {
            'Teacher': [
                { name: 'Create Course', icon: Plus, color: 'blue', description: 'Add new courses to the system' },
                { name: 'Grade Students', icon: Edit, color: 'green', description: 'Assign grades to student submissions' },
                { name: 'View Reports', icon: Eye, color: 'purple', description: 'Access detailed academic reports' },
                { name: 'Manage Assignments', icon: Database, color: 'orange', description: 'Create and manage assignments' }
            ],
            'Student': [
                { name: 'Enroll in Course', icon: Plus, color: 'blue', description: 'Register for available courses' },
                { name: 'View Grades', icon: Eye, color: 'green', description: 'Check your academic performance' },
                { name: 'Submit Assignments', icon: Database, color: 'purple', description: 'Upload completed assignments' },
                { name: 'View Schedule', icon: Settings, color: 'orange', description: 'Check your class schedule' }
            ],
            'Admin': [
                { name: 'Manage Users', icon: User, color: 'red', description: 'Add, edit, or remove users' },
                { name: 'Generate Reports', icon: Database, color: 'blue', description: 'Create system-wide reports' },
                { name: 'System Settings', icon: Settings, color: 'gray', description: 'Configure application settings' },
                { name: 'View Analytics', icon: Eye, color: 'green', description: 'Monitor system usage and performance' }
            ],
            'Customer': [
                { name: 'Browse Products', icon: Eye, color: 'blue', description: 'Explore available products' },
                { name: 'Place Orders', icon: Plus, color: 'green', description: 'Purchase items from the store' },
                { name: 'Track Orders', icon: Database, color: 'orange', description: 'Monitor order status and delivery' },
                { name: 'Manage Profile', icon: User, color: 'purple', description: 'Update personal information' }
            ],
            'Manager': [
                { name: 'View Dashboard', icon: Eye, color: 'blue', description: 'Access executive dashboard' },
                { name: 'Manage Team', icon: User, color: 'green', description: 'Oversee team members and assignments' },
                { name: 'Approve Requests', icon: Settings, color: 'orange', description: 'Review and approve various requests' },
                { name: 'Generate Reports', icon: Database, color: 'purple', description: 'Create management reports' }
            ]
        };

        return roleFeatureMappings[role] || [
            { name: 'View Data', icon: Eye, color: 'blue', description: 'Browse and view system data' },
            { name: 'Create Entry', icon: Plus, color: 'green', description: 'Add new entries to the system' },
            { name: 'Edit Entry', icon: Edit, color: 'orange', description: 'Modify existing entries' },
            { name: 'Settings', icon: Settings, color: 'gray', description: 'Access user settings' }
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
            <div className="app-header">
                <button onClick={() => navigate('/')} className="back-button">
                    <ArrowLeft className="icon" />
                    Back to Builder
                </button>
                <div className="header-content">
                    <h1>{requirements.appName}</h1>
                    <p>🎉 Your AI-Generated Application Interface</p>
                </div>
            </div>

            <div className="app-layout">
                {/* Role-based Navigation */}
                <nav className="role-nav">
                    <h3>
                        <User className="icon" />
                        User Roles
                    </h3>
                    {requirements.roles.map((role, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(role)}
                            className={`nav-button ${activeTab === role ? 'active' : ''}`}
                        >
                            <User className="icon" />
                            {role}
                        </button>
                    ))}
                </nav>

                {/* Main Content Area */}
                <main className="app-content">
                    <div className="content-header">
                        <h2>{activeTab} Dashboard</h2>
                        <p>Welcome to your {activeTab.toLowerCase()} interface</p>
                    </div>

                    {/* Role Features */}
                    <div className="role-features">
                        <h3>Available Actions</h3>
                        <div className="feature-grid">
                            {generateRoleFeatures(activeTab).map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <button key={index} className={`feature-button ${feature.color}`}>
                                        <IconComponent className="feature-icon" />
                                        <div className="feature-content">
                                            <span className="feature-name">{feature.name}</span>
                                            <span className="feature-desc">{feature.description}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Entity Management Section */}
                    <div className="entity-section">
                        <h3>
                            <Database className="icon" />
                            Data Management
                        </h3>
                        <div className="entity-tabs">
                            {requirements.entities.map((entity, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveEntity(entity)}
                                    className={`entity-tab ${activeEntity === entity ? 'active' : ''}`}
                                >
                                    <Database className="icon" />
                                    {entity}
                                </button>
                            ))}
                        </div>

                        {activeEntity && (
                            <div className="entity-content">
                                <form onSubmit={handleFormSubmit} className="entity-form">
                                    <div className="form-header">
                                        <h4>Add New {activeEntity}</h4>
                                        <p>Fill in the details to create a new {activeEntity.toLowerCase()}</p>
                                    </div>

                                    <div className="form-grid">
                                        {generateEntityFields(activeEntity).map((field, index) => (
                                            <div key={index} className="form-field">
                                                <label htmlFor={field.name} className="form-label">
                                                    {field.label}
                                                </label>
                                                {renderFormField(field)}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit primary">
                                            <Plus className="icon" />
                                            Add {activeEntity}
                                        </button>
                                        <button type="button" className="form-submit secondary" onClick={() => setFormData({})}>
                                            Clear Form
                                        </button>
                                    </div>
                                </form>

                                {/* Sample Data Table */}
                                <div className="data-preview">
                                    <h4>Recent {activeEntity} Records</h4>
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead>
                                            <tr>
                                                {generateEntityFields(activeEntity).slice(0, 4).map((field, index) => (
                                                    <th key={index}>{field.label}</th>
                                                ))}
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td colSpan={5} className="no-data">
                                                    No {activeEntity.toLowerCase()} records found. Add some data using the form above!
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Sidebar with Requirements Summary */}
                <aside className="requirements-sidebar">
                    <h3>
                        <Settings className="icon" />
                        App Specifications
                    </h3>
                    <div className="requirements-summary">
                        <div className="summary-item">
                            <strong>📱 Application:</strong>
                            <span className="app-name">{requirements.appName}</span>
                        </div>

                        <div className="summary-item">
                            <strong>🗃️ Entities ({requirements.entities.length}):</strong>
                            <div className="entity-list">
                                {requirements.entities.map((entity, index) => (
                                    <span key={index} className="entity-badge">
                    {entity}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="summary-item">
                            <strong>👥 User Roles ({requirements.roles.length}):</strong>
                            <div className="role-list">
                                {requirements.roles.map((role, index) => (
                                    <span key={index} className="role-badge">
                    {role}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="summary-item">
                            <strong>⚡ Key Features ({requirements.features.length}):</strong>
                            <ul className="feature-list">
                                {requirements.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="demo-note">
                            <p><strong>Note:</strong> This is a generated demo interface based on your requirements. All forms and actions are for demonstration purposes.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default GeneratedApp;