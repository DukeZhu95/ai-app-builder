import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import RequirementCapture from './components/RequirementCapture';
import GeneratedApp from './components/GeneratedApp';
import SavedApps from './components/SavedApps';
import { Database, Home, Plus } from 'lucide-react';
import './App.css';

// Navigation Component
const Navigation = () => {
    const location = useLocation();

    // Don't show navigation on generated-app page
    if (location.pathname === '/generated-app') {
        return null;
    }

    return (
        <nav className="app-navigation">
            <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
                <Home className="nav-icon" />
                Create New App
            </Link>
            <Link
                to="/saved-apps"
                className={`nav-link ${location.pathname === '/saved-apps' ? 'active' : ''}`}
            >
                <Database className="nav-icon" />
                View Saved Apps
            </Link>
        </nav>
    );
};

function App() {
    const [appRequirements, setAppRequirements] = useState(null);

    return (
        <Router>
            <div className="App">
                <header className="app-header">
                    <h1>🤖 AI App Builder Portal</h1>
                    <p>Describe your app and watch it come to life!</p>
                </header>

                <Navigation />

                <main className="app-main">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <RequirementCapture
                                    onRequirementsGenerated={setAppRequirements}
                                />
                            }
                        />
                        <Route
                            path="/generated-app"
                            element={
                                appRequirements ?
                                    <GeneratedApp requirements={appRequirements} /> :
                                    <Navigate to="/" />
                            }
                        />
                        <Route
                            path="/saved-apps"
                            element={<SavedApps />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;