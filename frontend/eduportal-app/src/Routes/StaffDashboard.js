import React from 'react';
import Profile from '../Components/Profile';
import StaffNavigation from '../Components/StaffNavigation';
import DepartmentCheck from '../Components/StaffDepartmentCheck'; // Check authorization

const StaffDashboard = () => {
    const userId = 1;
    const departmentId = 1;

    return (
        <div className="StaffDashboard">
            <Profile />
            <StaffNavigation />
            <DepartmentCheck userId={userId} departmentId={departmentId} />
        </div>
    );
};

export default StaffDashboard;
