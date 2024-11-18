import React from 'react';
import Profile from '../Components/Profile';
import SystemAdminNavigation from '../Components/SystemAdminNavigation';
import LogsTable from '../Components/SystemAdminLogsTable'
import './SystemAdminDashboard.css';

const SystemAdminDashboard = () => {
    return (
        <div className="SystemAdminDashboard container text-center">
            {/* Row 1: System Admin Head */}
            <div className="SystemAdminHead row align-items-center mb-5">
                {/* Profile */}
                <div className="col-12 col-md-4 d-flex justify-content-md-start"> {/* col-12 for small screens, col-md-4 for medium and up */}
                    <Profile />
                </div>

                {/* System Admin Navigation */}
                <div className="col-12 col-md-8 d-flex justify-content-md-end"> {/* col-12 for small screens, col-md-8 for medium and up */}
                    <SystemAdminNavigation />
                </div>
            </div>

            {/* Row 2: Logs Title */}
            <div className="StudentLogsTitle row mb-3">
                <div className="col">
                    <h3>Logs</h3>
                </div>
            </div>
            
            {/* Row 3: Logs Table */}
            <div className="StudentLogsList row">
                <div className="col">
                    <LogsTable />
                </div>
            </div>
        </div>
    )
}

export default SystemAdminDashboard;