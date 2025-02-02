import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false); // Toggle registration form
    const [organizationDetails, setOrganizationDetails] = useState({
        name: '',
        location: '',
        bussiness: '',
        status: 'PRIVATE',
    });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const response = await axios.post(`${API_URL}/login/`, { username, password });

            const { access, refresh, role, organization_registered } = response.data; // Backend should return this
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('role', role);

            if (role === 'customer') {
                if (!organization_registered) {
                    setShowRegistration(true); // Show organization registration form
                } else {
                    navigate('/make-order'); // Redirect to order page
                }
            } else if (role === 'admin') {
                navigate('/home'); // Admin dashboard
            } else {
                setError('Unauthorized role. Please contact support.');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                `${API_URL}/organization/`,
                organizationDetails,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Organization registered successfully!');
            navigate('/make-order'); // Redirect to order page after registration
        } catch (err) {
            console.error(err);
            setError('Failed to register organization. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (showRegistration) {
        // Organization Registration Form
        return (
            <div>
                <h2>Register Organization</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <form onSubmit={handleRegistration}>
                    <div>
                        <label htmlFor="name">Organization Name</label>
                        <input
                            type="text"
                            id="name"
                            value={organizationDetails.name}
                            onChange={(e) =>
                                setOrganizationDetails({ ...organizationDetails, name: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            value={organizationDetails.location}
                            onChange={(e) =>
                                setOrganizationDetails({ ...organizationDetails, location: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="bussiness">Business</label>
                        <input
                            type="text"
                            id="bussiness"
                            value={organizationDetails.bussiness}
                            onChange={(e) =>
                                setOrganizationDetails({ ...organizationDetails, bussiness: e.target.value })
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={organizationDetails.status}
                            onChange={(e) =>
                                setOrganizationDetails({ ...organizationDetails, status: e.target.value })
                            }
                            required
                        >
                            <option value="PRIVATE">Private</option>
                            <option value="PUBLIC">Public</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>
            </div>
        );
    }

    // Login Form
    return (
        <div>
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
