import React from 'react';
import Profile from '../Components/Profile';
import StaffNavigation from '../Components/StaffNavigation';

const StaffDashboard = () => {
    return (
        <div className="StaffDashboard">
            <Profile/>
            <StaffNavigation/>
        </div>
    )
}

export default StaffDashboard