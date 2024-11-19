// export default SystemAdminDashboard;
import React, { useState } from 'react';
import Profile from '../Components/SystemAdminProfile';
import SystemAdminNavigation from '../Components/SystemAdminNavigation';
import LogsTable from '../Components/SystemAdminLogsTable';
import SystemAdminGPAStatisticsTable from '../Components/SystemAdminGPAStatisticsTable'; // Import your GPA Statistics table
import './SystemAdminDashboard.css';

const SystemAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('logs'); // Track which table is active: 'logs' or 'gpa'

    return (
        <div className="SystemAdminDashboard container text-center">
            {/* Row 1: System Admin Head */}
            <div className="SystemAdminHead row align-items-center mb-5">
                {/* Profile */}
                <div className="col-12 col-md-4 d-flex justify-content-md-start">
                    <Profile />
                </div>

                {/* System Admin Navigation */}
                <div className="col-12 col-md-8 d-flex justify-content-md-end">
                    <SystemAdminNavigation />
                </div>
            </div>

            {/* Row 2: Button Toggle */}
            <div className="row mb-4 justify-content-center">
                <div className="btn-group">
                    <button
                        className={`btn btn-outline-primary ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        Logs
                    </button>
                    <button
                        className={`btn btn-outline-secondary ${activeTab === 'gpa' ? 'active' : ''}`}
                        onClick={() => setActiveTab('gpa')}
                    >
                        Major GPA Rankings
                    </button>
                </div>
            </div>

            {/* Row 3: Render Tables */}
            <div className="row">
                {activeTab === 'logs' && (
                    <div className="col">
                        <LogsTable />
                    </div>
                )}
                {activeTab === 'gpa' && (
                    <div className="col">
                        <SystemAdminGPAStatisticsTable /> {/* Call your GPA Statistics Table */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SystemAdminDashboard;
