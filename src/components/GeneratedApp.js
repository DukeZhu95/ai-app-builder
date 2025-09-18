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

            // Reset saved status after 3 seconds
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
            'Workout': [
                { name: 'name', type: 'text', label: 'Workout Name', placeholder: 'Morning Run' },
                { name: 'type', type: 'select', label: 'Exercise Type', options: ['Cardio', 'Strength', 'Flexibility', 'Sports'] },
                { name: 'duration', type: 'number', label: 'Duration (minutes)', placeholder: '30' },
                { name: 'calories', type: 'number', label: 'Calories Burned', placeholder: '250' },
                { name: 'date', type: 'date', label: 'Workout Date' }
            ],
            'Nutrition': [
                { name: 'meal', type: 'select', label: 'Meal Type', options: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
                { name: 'food', type: 'text', label: 'Food Item', placeholder: 'Grilled Chicken Salad' },
                { name: 'calories', type: 'number', label: 'Calories', placeholder: '350' },
                { name: 'protein', type: 'number', label: 'Protein (g)', placeholder: '25' },
                { name: 'date', type: 'date', label: 'Date' }
            ],
            'Fitness Goal': [
                { name: 'title', type: 'text', label: 'Goal Title', placeholder: 'Lose 10 pounds' },
                { name: 'category', type: 'select', label: 'Category', options: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Strength'] },
                { name: 'target', type: 'number', label: 'Target Value', placeholder: '10' },
                { name: 'current', type: 'number', label: 'Current Progress', placeholder: '2' },
                { name: 'deadline', type: 'date', label: 'Target Date' }
            ],
            'Personal Trainer': [
                { name: 'name', type: 'text', label: 'Trainer Name', placeholder: 'John Smith' },
                { name: 'specialization', type: 'text', label: 'Specialization', placeholder: 'Weight Training' },
                { name: 'experience', type: 'number', label: 'Years Experience', placeholder: '5' },
                { name: 'rating', type: 'number', label: 'Rating (1-5)', placeholder: '4.8' },
                { name: 'hourlyRate', type: 'number', label: 'Hourly Rate ($)', placeholder: '75' }
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
            'User': [
                { name: 'Log Workout', icon: Plus, color: 'blue', description: 'Record your exercise sessions' },
                { name: 'Track Nutrition', icon: Database, color: 'green', description: 'Monitor your daily food intake' },
                { name: 'View Progress', icon: Eye, color: 'purple', description: 'Check your fitness progress' },
                { name: 'Set Goals', icon: Settings, color: 'orange', description: 'Define your fitness objectives' }
            ],
            'Personal Trainer': [
                { name: 'Manage Clients', icon: User, color: 'blue', description: 'Oversee client fitness programs' },
                { name: 'Create Workouts', icon: Plus, color: 'green', description: 'Design custom workout plans' },
                { name: 'Track Client Progress', icon: Eye, color: 'purple', description: 'Monitor client achievements' },
                { name: 'Schedule Sessions', icon: Settings, color: 'orange', description: 'Manage training appointments' }
            ],
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
                <div className="header-left">
                    <button onClick={() => navigate('/')} className="back-button">
                        <ArrowLeft className="icon" />
                        Back to Builder
                    </button>
                </div>
                <div className="header-content">
                    <h1>{requirements.appName}</h1>
                    <p>🎉 Your AI-Generated Application Interface</p>
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