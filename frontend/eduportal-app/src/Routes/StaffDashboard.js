import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; 

const StaffDashboard = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate("/");
    }
}