
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const DepartmentCheck = ({ userId, departmentId }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/staff_in_department', {
                    params: { user_id: userId, department_id: departmentId },
                });
                setIsAuthorized(true);
            } catch (error) {
                setIsAuthorized(false);
            }
        };
        checkDepartment();
    }, [userId, departmentId]);

    return (
        <div className="container mt-3">
            {isAuthorized ? (
                <div className="alert alert-success">Access to department allowed</div>
            ) : (
                <div className="alert alert-danger">Access denied to this department</div>
            )}
        </div>
    );
};

export default DepartmentCheck;
