import React from 'react';
import StaffProfile from '../Components/StaffProfile';
import StaffNavigation from '../Components/StaffNavigation';
import DepartmentCheck from '../Components/StaffDepartmentCheck'; // Check authorization

const StaffDashboard = () => {
    const userId = 1;
    const departmentId = 1;

    return (
        <div className="StaffDashboard">
            <StaffProfile />
            <StaffNavigation />
            <DepartmentCheck userId={userId} departmentId={departmentId} />
        </div>
    );
};

export default StaffDashboard;
