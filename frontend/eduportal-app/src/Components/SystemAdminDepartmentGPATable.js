// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './SystemAdminDepartmentGPATable.css'


// const DepartmentGPATable = () => {
//     const [rankings, setRankings] = useState([]);
//     const [highest, setHighest] = useState(null);
//     const [lowest, setLowest] = useState(null);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchRankings = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:5000/admin_department_gpa_rankings');
//                 setRankings(response.data.rankings);
//                 setHighest(response.data.highest_gpa_department);
//                 setLowest(response.data.lowest_gpa_department);
//             } catch (err) {
//                 setError('Failed to fetch department GPA rankings.');
//             }
//         };

//         fetchRankings();
//     }, []);

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center mb-4">Department GPA Rankings</h1>
//             {error && <div className="alert alert-danger">{error}</div>}

//             <div className="card p-4 mb-5">
//                 <h2>Highest and Lowest GPAs</h2>
//                 <ul className="list-group mb-4">
//                     <li className="list-group-item">
//                         <strong>Highest GPA Department:</strong>{' '}
//                         {highest ? `${highest.department_name} (${highest.average_gpa.toFixed(2)})` : 'N/A'}
//                     </li>
//                     <li className="list-group-item">
//                         <strong>Lowest GPA Department:</strong>{' '}
//                         {lowest ? `${lowest.department_name} (${lowest.average_gpa.toFixed(2)})` : 'N/A'}
//                     </li>
//                 </ul>
//             </div>

//             <table className="table table-striped table-bordered">
//                 <thead>
//                     <tr>
//                         <th scope="col">Rank</th>
//                         <th scope="col">Department</th>
//                         <th scope="col">Average GPA</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {rankings.map((department, index) => (
//                         <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{department.department_name}</td>
//                             <td>{department.average_gpa.toFixed(2)}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DepartmentGPATable;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SystemAdminDepartmentGPATable.css';

const DepartmentGPATable = () => {
    const [rankings, setRankings] = useState([]);
    const [highest, setHighest] = useState(null);
    const [lowest, setLowest] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/admin_department_gpa_rankings');
                const data = response.data;

                // Process rankings if the API returns an array
                if (Array.isArray(data)) {
                    setRankings(data);
                }

                // Calculate highest and lowest if they are not returned directly
                if (data.length > 0) {
                    setHighest(data[0]); // First item is the highest-ranked department
                    setLowest(data[data.length - 1]); // Last item is the lowest-ranked department
                }
            } catch (err) {
                setError('Failed to fetch department GPA rankings.');
            }
        };

        fetchRankings();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Department GPA Rankings</h1>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card p-4 mb-5">
                <h2>Highest and Lowest GPAs</h2>
                <ul className="list-group mb-4">
                    <li className="list-group-item">
                        <strong>Highest GPA Department:</strong>{' '}
                        {highest ? `${highest.department_name} (${highest.average_gpa.toFixed(2)})` : 'N/A'}
                    </li>
                    <li className="list-group-item">
                        <strong>Lowest GPA Department:</strong>{' '}
                        {lowest ? `${lowest.department_name} (${lowest.average_gpa.toFixed(2)})` : 'N/A'}
                    </li>
                </ul>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Rank</th>
                        <th scope="col">Department</th>
                        <th scope="col">Highest GPA</th>
                        <th scope="col">Lowest GPA</th>
                        <th scope="col">Average GPA</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(rankings) &&
                        rankings.map((department, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{department.department_name}</td>
                                <td>{department.highest_gpa.toFixed(2)}</td>
                                <td>{department.lowest_gpa.toFixed(2)}</td>
                                <td>{department.average_gpa.toFixed(2)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepartmentGPATable;
