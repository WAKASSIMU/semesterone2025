// ArmedSecurityGuardsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ArmedSecurityGuardsList = () => {
    const [guards, setGuards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/guards/')
            .then(response => {
                setGuards(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching data.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Armed Security Guards</h2>
            <ul>
                {guards.map(guard => (
                    <li key={guard.id}>
                        <strong>{guard.name}</strong> - {guard.rank}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArmedSecurityGuardsList;
