import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffInstructorsTable = ({ instructors }) => {
    return (
        <div className="col-md-6">
            <h2 className="text-center">Instructors</h2>
            <table className="table table-striped table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Instructor ID</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {instructors.map((instructor) => (
                        <tr key={instructor.instructor_id}>
                            <td>{instructor.instructor_id}</td>
                            <td>{instructor.username}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffInstructorsTable;
