// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const StaffManageAdvisors = () => {
//     const [advisors, setAdvisors] = useState([]);
//     const [id, setId] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [department, setDepartment] = useState('');
//     const [action, setAction] = useState('');
//     const [success, setSuccess] = useState('');
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchAdvisors = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/getStaffAdvisors');
//                 setAdvisors(response.data);
//             } catch (error) {
//                 setError('Failed to fetch advisors.');
//             }
//         };
//         fetchAdvisors();
//     }, []);

//     const handleSubmit = async () => {
//         try {
//             const response = await axios.post('http://127.0.0.1:5000/manage_advisors', {
//                 action,
//                 id,
//                 username,
//                 password,
//                 department,
//             });
//             setSuccess(response.data.message);
//             setError('');
//         } catch (error) {
//             setError('Operation failed. Please try again.');
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">Manage Advisors</h1>

//             {error && <div className="alert alert-danger">{error}</div>}
//             {success && <div className="alert alert-success">{success}</div>}

//             <div className="card p-4 mb-5">
//                 <h2>Advisor Form</h2>
//                 <div className="form-group mb-3">
//                     <label>ID</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={id}
//                         onChange={(e) => setId(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Username</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Password</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group mb-3">
//                     <label>Department</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={department}
//                         onChange={(e) => setDepartment(e.target.value)}
//                     />
//                 </div>
//                 <div className="d-flex gap-2">
//                     <button
//                         className="btn btn-primary"
//                         onClick={() => {
//                             setAction('add');
//                             handleSubmit();
//                         }}
//                     >
//                         Add Advisor
//                     </button>
//                     <button
//                         className="btn btn-warning"
//                         onClick={() => {
//                             setAction('update');
//                             handleSubmit();
//                         }}
//                     >
//                         Update Advisor
//                     </button>
//                     <button
//                         className="btn btn-danger"
//                         onClick={() => {
//                             setAction('delete');
//                             handleSubmit();
//                         }}
//                     >
//                         Delete Advisor
//                     </button>
//                 </div>
//             </div>

//             <div className="card p-4">
//                 <h2>Advisors List</h2>
//                 <table className="table table-striped table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Advisor ID</th>
//                             <th>Username</th>
//                             <th>Department</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {advisors.map((advisor) => (
//                             <tr key={advisor.id}>
//                                 <td>{advisor.id}</td>
//                                 <td>{advisor.username}</td>
//                                 <td>{advisor.department}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default StaffManageAdvisors;
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StaffAdvisorsTable from './StaffAdvisorsTable'; // Import the AdvisorsTable component

const StaffManageAdvisors = () => {
    const [id, setId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [action, setAction] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/manage_advisors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, id, username, password, department }),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setError('');
            } else {
                setError(data.error);
                setSuccess('');
            }
        } catch (err) {
            setError('Operation failed. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Manage Advisors</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card p-4 mb-5">
                <h2>Advisor Form</h2>
                <div className="form-group mb-3">
                    <label>ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Department</label>
                    <input
                        type="text"
                        className="form-control"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setAction('add');
                            handleSubmit();
                        }}
                    >
                        Add Advisor
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => {
                            setAction('update');
                            handleSubmit();
                        }}
                    >
                        Update Advisor
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            setAction('delete');
                            handleSubmit();
                        }}
                    >
                        Delete Advisor
                    </button>
                </div>
            </div>

            {/* Include the AdvisorsTable component */}
            <StaffAdvisorsTable />
        </div>
    );
};

export default StaffManageAdvisors;
