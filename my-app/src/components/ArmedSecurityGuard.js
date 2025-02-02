import React, { Component } from 'react';

class ArmedSecurityGuards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guards: [], // List of guards
            offices: [], // List of offices
            loading: true, // Loading state
            error: null,   // Error handling
            showForm: false, // Toggle form visibility
            newGuard: {
                id: '',
                name: '',
                age: '',
                phone: '',
                adress: '',
                status: '',
                gender: '',
                worked_office: '', // Initially empty, will be selected by name
            }, // Form data for new guard
        };
    }

    componentDidMount() {
        // Fetch data from the API for guards and offices
        Promise.all([
            fetch('http://127.0.0.1:8000/api/armedsecurityguard/'),
            fetch('http://127.0.0.1:8000/api/securityoffice/')
        ])
            .then(([guardsResponse, officesResponse]) => {
                if (!guardsResponse.ok || !officesResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                return Promise.all([guardsResponse.json(), officesResponse.json()]);
            })
            .then(([guardsData, officesData]) => {
                this.setState({
                    guards: guardsData,
                    offices: officesData,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    }

    toggleForm = () => {
        this.setState((prevState) => ({ showForm: !prevState.showForm }));
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newGuard: { ...prevState.newGuard, [name]: value },
        }));
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { newGuard } = this.state;

        // If guard has an ID, it's an update, otherwise it's a new guard
        const method = newGuard.id ? 'PUT' : 'POST';
        const url = newGuard.id 
            ? `http://127.0.0.1:8000/api/armedsecurityguard/${newGuard.id}/`
            : 'http://127.0.0.1:8000/api/armedsecurityguard/';

        // Request to add or update a guard
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGuard),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(method === 'POST' ? 'Failed to create guard' : 'Failed to update guard');
                }
                return response.json();
            })
            .then((data) => {
                // Update the list and reset the form
                this.setState((prevState) => ({
                    guards: method === 'POST' ? [...prevState.guards, data] : prevState.guards.map(guard => guard.id === newGuard.id ? data : guard),
                    showForm: false,
                    newGuard: {
                        id: '',
                        name: '',
                        age: '',
                        phone: '',
                        adress: '',
                        status: '',
                        gender: '',
                        worked_office: '',
                    },
                }));
            })
            .catch((error) => {
                this.setState({ error: error.message });
            });
    };

    handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/api/armedsecurityguard/${id}/`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete guard');
                }
                this.setState((prevState) => ({
                    guards: prevState.guards.filter(guard => guard.id !== id)
                }));
            })
            .catch((error) => {
                this.setState({ error: error.message });
            });
    };

    handleEdit = (guard) => {
        this.setState({
            newGuard: { ...guard },
            showForm: true,
        });
    };

    render() {
        const { guards, offices, loading, error, showForm, newGuard } = this.state;

        return (
            <div>
                <h1>Armed Security Guards</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleForm}
                    style={{ marginBottom: '20px' }}
                >
                    {showForm ? 'Close Form' : 'Add New Guard'}
                </button>
                {showForm && (
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={newGuard.name}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                className="form-control"
                                value={newGuard.age}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone:</label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                className="form-control"
                                value={newGuard.phone}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="adress">Address:</label>
                            <input
                                type="text"
                                id="adress"
                                name="adress"
                                className="form-control"
                                value={newGuard.adress}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                className="form-control"
                                value={newGuard.status}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="ORDINARY">ORDINARY</option>
                                <option value="ADVANCED">ADVANCED</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender:</label>
                            <select
                                id="gender"
                                name="gender"
                                className="form-control"
                                value={newGuard.gender}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="worked_office">Worked Office:</label>
                            <select
                                id="worked_office"
                                name="worked_office"
                                className="form-control"
                                value={newGuard.worked_office}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.officename}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success" style={{ marginTop: '10px' }}>
                            Submit
                        </button>
                    </form>
                )}
                <table className="table table-striped" style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th scope="col">SN</th>
                            <th scope="col">Name</th>
                            <th scope="col">Age</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Address</th>
                            <th scope="col">Status</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Worked Office</th>
                            <th scope="col">Actions</th> {/* Add Actions column */}
                        </tr>
                    </thead>
                    <tbody>
                        {guards.map((guard, index) => {
                            const office = offices.find((office) => office.id === guard.worked_office);
                            return (
                                <tr key={guard.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{guard.name}</td>
                                    <td>{guard.age}</td>
                                    <td>{guard.phone}</td>
                                    <td>{guard.adress}</td>
                                    <td>{guard.status}</td>
                                    <td>{guard.gender === 'M' ? 'Male' : 'Female'}</td>
                                    <td>{office ? office.officename : 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => this.handleEdit(guard)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => this.handleDelete(guard.id)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ArmedSecurityGuards;
