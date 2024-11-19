import React, { useState } from 'react';
import {
    Container,
    Box,
    Button,
    ButtonGroup,
} from '@mui/material';
import ManageCoursesPage from './StaffManagingCoursesPage';
import AssignInstructorsPage from './StaffAssigningInstructorsPage';
import StaffManageAdvisors from './StaffManageAdvisors';
import StaffManageInstructors from './StaffManageInstructors';
import StaffManageStudents from './StaffManageStudents';

const StaffNavigation = () => {
    const [activePage, setActivePage] = useState('manage_courses'); // Track active page

    return (
        <Container style={{ marginTop: '2rem' }}>
            {/* Button Toggle Group */}
            <Box textAlign="center" marginBottom={4}>
                <ButtonGroup variant="outlined" color="primary">
                    <Button
                        variant={activePage === 'manage_students' ? 'contained' : 'outlined'}
                        onClick={() => setActivePage('manage_students')}
                    >
                        Manage Students
                    </Button>
                    <Button
                        variant={activePage === 'manage_courses' ? 'contained' : 'outlined'}
                        onClick={() => setActivePage('manage_courses')}
                    >
                        Manage Courses
                    </Button>
                    <Button
                        variant={activePage === 'assign_instructors' ? 'contained' : 'outlined'}
                        onClick={() => setActivePage('assign_instructors')}
                    >
                        Assign Instructors
                    </Button>
                    <Button
                        variant={activePage === 'manage_instructors' ? 'contained' : 'outlined'}
                        onClick={() => setActivePage('manage_instructors')}
                    >
                        Manage Instructors
                    </Button>
                    <Button
                        variant={activePage === 'manage_advisors' ? 'contained' : 'outlined'}
                        onClick={() => setActivePage('manage_advisors')}
                    >
                        Manage Advisors
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Render Active Page */}
            <Box>
                {activePage === 'manage_students' && <StaffManageStudents />}
                {activePage === 'manage_courses' && <ManageCoursesPage />}
                {activePage === 'assign_instructors' && <AssignInstructorsPage />}
                {activePage === 'manage_instructors' && <StaffManageInstructors />}
                {activePage === 'manage_advisors' && <StaffManageAdvisors />}
            </Box>
        </Container>
    );
};

export default StaffNavigation;
