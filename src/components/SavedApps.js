import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Calendar, Users, Database, List } from 'lucide-react';
import axios from 'axios';
import '../styles/SavedApps.css';

const SavedApps = () => {
    const [savedApps, setSavedApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSavedApps();
    }, []);

    const fetchSavedApps = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/apps');

            // Adjust according to your API response structure
            if (response.data.apps) {
                setSavedApps(response.data.apps);
            } else {
                setSavedApps(response.data);
            }
        } catch (error) {
            console.error('Error fetching saved apps:', error);
            setError('Failed to load saved applications');
        } finally {
            setLoading(false);
        }
    };

    const deleteApp = async (appId) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await axios.delete(`http://localhost:5000/api/apps/${appId}`);
                setSavedApps(prev => prev.filter(app => app._id !== appId));
            } catch (error) {
                console.error('Error deleting app:', error);
                alert('Failed to delete application');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="saved-apps-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading saved applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="saved-apps-container">
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchSavedApps} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-apps-container">
            <div className="apps-header">
                <h1>Saved Applications</h1>
                <p>Manage your AI-generated applications</p>
            </div>

            {savedApps.length === 0 ? (
                <div className="empty-state">
                    <Database className="empty-icon" />
                    <h3>No Applications Saved</h3>
                    <p>Create and save applications to see them here</p>
                </div>
            ) : (
                <div className="apps-grid">
                    {savedApps.map((app) => (
                        <div key={app._id} className="app-card">
                            {/* Card Header with Gradient Background */}
                            <div className="app-card-header">
                                <div>
                                    <h3 className="app-name">{app.appName}</h3>
                                    <p className="app-description">{app.description}</p>
                                </div>
                                <div className="app-actions">
                                    <button
                                        className="action-button view"
                                        title="View Details"
                                    >
                                        <Eye className="icon" />
                                    </button>
                                    <button
                                        className="action-button delete"
                                        onClick={() => deleteApp(app._id)}
                                        title="Delete Application"
                                    >
                                        <Trash2 className="icon" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="app-card-body">
                                {/* App Stats */}
                                <div className="app-stats">
                                    <div className="stat-item">
                                        <Users className="stat-icon" />
                                        <div className="stat-number">{app.roles?.length || 0}</div>
                                        <div className="stat-label">Roles</div>
                                    </div>
                                    <div className="stat-item">
                                        <Database className="stat-icon" />
                                        <div className="stat-number">{app.entities?.length || 0}</div>
                                        <div className="stat-label">Entities</div>
                                    </div>
                                    <div className="stat-item">
                                        <List className="stat-icon" />
                                        <div className="stat-number">{app.features?.length || 0}</div>
                                        <div className="stat-label">Features</div>
                                    </div>
                                </div>

                                {/* App Details */}
                                <div className="app-details">
                                    <div className="detail-section">
                                        <h4>
                                            <Database className="stat-icon" />
                                            Entities
                                        </h4>
                                        <div className="badge-group">
                                            {app.entities?.map((entity, index) => (
                                                <span key={index} className="badge entity-badge">
                                                    {entity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>
                                            <Users className="stat-icon" />
                                            User Roles
                                        </h4>
                                        <div className="badge-group">
                                            {app.roles?.map((role, index) => (
                                                <span key={index} className="badge role-badge">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>
                                            <List className="stat-icon" />
                                            Features
                                        </h4>
                                        <ul className="feature-list">
                                            {app.features?.slice(0, 4).map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                            {app.features?.length > 4 && (
                                                <li className="more-features">
                                                    +{app.features.length - 4} more features
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="app-footer">
                                <div className="created-date">
                                    <Calendar className="icon" />
                                    <span>Created {formatDate(app.createdAt || app.created || new Date())}</span>
                                </div>
                                <div className="app-status">Active</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedApps;