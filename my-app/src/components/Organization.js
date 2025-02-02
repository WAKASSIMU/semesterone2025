import React, { Component } from 'react';

class Organizations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizations: [], // State to hold the fetched data
            loading: true, // To show a loading state
            error: null,   // To handle errors
            showForm: false, // To toggle the form visibility
            newOrganization: {
                id: '',
                name: '',
                location: '',
                bussiness: '',
                password: '',
                status: '',
            }, // To hold form input values
        };
    }

    componentDidMount() {
        // Fetch data from the API
        fetch('http://127.0.0.1:8000/api/organization/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                this.setState({ organizations: data, loading: false });
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
            newOrganization: { ...prevState.newOrganization, [name]: value },
        }));
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { newOrganization } = this.state;

        // Check if it's a new organization (POST) or an update (PUT)
        const isUpdating = newOrganization.id;

        const method = isUpdating ? 'PUT' : 'POST';
        const url = isUpdating
            ? `http://127.0.0.1:8000/api/organization/${newOrganization.id}/`
            : 'http://127.0.0.1:8000/api/organization/';

        // Send the request (POST for new, PUT for update)
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrganization),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(isUpdating ? 'Failed to update organization' : 'Failed to create organization');
                }
                return response.json();
            })
            .then((data) => {
                if (isUpdating) {
                    // Update the organization in the list (replace the old one)
                    this.setState((prevState) => ({
                        organizations: prevState.organizations.map((org) =>
                            org.id === newOrganization.id ? data : org
                        ),
                        newOrganization: {
                            id: '',
                            name: '',
                            location: '',
                            bussiness: '',
                            password: '',
                            status: '',
                        },
                        showForm: false,
                    }));
                } else {
                    // Add new organization to the list
                    this.setState((prevState) => ({
                        organizations: [...prevState.organizations, data],
                        newOrganization: {
                            name: '',
                            location: '',
                            bussiness: '',
                            password: '',
                            status: '',
                        },
                        showForm: false,
                    }));
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({ error: error.message });
            });
    };

    handleDelete = (id) => {
        // Logic to handle deleting an organization
        fetch(`http://127.0.0.1:8000/api/organization/${id}/`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete organization');
                }
                // Remove the deleted organization from the state
                this.setState((prevState) => ({
                    organizations: prevState.organizations.filter((org) => org.id !== id),
                }));
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to delete organization. Please try again.');
            });
    };

    handleUpdate = (id) => {
        // Find the organization by ID
        const organizationToUpdate = this.state.organizations.find((org) => org.id === id);

        // Populate the form with the existing organization details
        this.setState({
            showForm: true,
            newOrganization: {
                id: organizationToUpdate.id,
                name: organizationToUpdate.name,
                location: organizationToUpdate.location,
                bussiness: organizationToUpdate.bussiness,
                password: organizationToUpdate.password,
                status: organizationToUpdate.status,
            },
        });
    };

    render() {
        const { organizations, loading, error, showForm, newOrganization } = this.state;

        return (
            <div>
                <h1>Organizations</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button type="button" className="btn btn-primary" onClick={this.toggleForm}>
                    {showForm ? 'Close Form' : 'Add'}
                </button>
                {showForm && (
                    <form onSubmit={this.handleFormSubmit} style={{ marginTop: '20px' }}>
                        <div className="form-group">
                            <label htmlFor="name">Organization Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={newOrganization.name}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location:</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="form-control"
                                value={newOrganization.location}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bussiness">Bussiness:</label>
                            <input
                                type="text"
                                id="bussiness"
                                name="bussiness"
                                className="form-control"
                                value={newOrganization.bussiness}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                value={newOrganization.password}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                name="status"
                                className="form-control"
                                value={newOrganization.status}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="PRIVATE">PRIVATE</option>
                                <option value="PUBLIC">PUBLIC</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success" style={{ marginTop: '10px' }}>
                            Submit
                        </button>
                    </form>
                )}
                <table className="table" style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th scope="col">SN</th>
                            <th scope="col">Name</th>
                            <th scope="col">Location</th>
                            <th scope="col">Bussiness</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.map((org, index) => (
                            <tr key={org.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{org.name}</td>
                                <td>{org.location}</td>
                                <td>{org.bussiness}</td>
                                <td>{org.status}</td>
                                <td>
                                    <button
                                        className="btn btn-warning"
                                        style={{ marginRight: '10px' }}
                                        onClick={() => this.handleUpdate(org.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => this.handleDelete(org.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Organizations;
