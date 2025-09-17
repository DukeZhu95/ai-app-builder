import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequirementCapture from './components/RequirementCapture';
import GeneratedApp from './components/GeneratedApp';
import './App.css';

function App() {
    const [appRequirements, setAppRequirements] = useState(null);

    return (
        <Router>
            <div className="App">
                <header className="app-header">
                    <h1>🤖 AI App Builder Portal</h1>
                    <p>Describe your app and watch it come to life!</p>
                </header>

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
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;