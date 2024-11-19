import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DepartmentCheck = ({ userId, departmentId }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkDepartment = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/staff_in_department', {
                    params: { user_id: userId, department_id: departmentId }
                });
                setIsAuthorized(true);
            } catch (error) {
                setIsAuthorized(false);
            }
        };
        checkDepartment();
    }, [userId, departmentId]);

    return (
        <div>
            {isAuthorized ? (
                <p>Access to department allowed</p>
            ) : (
                <p style={{ color: 'red' }}>Access denied to this department</p>
            )}
        </div>
    );
};

export default DepartmentCheck;
