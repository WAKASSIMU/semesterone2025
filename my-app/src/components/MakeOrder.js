import React, { Component } from 'react';

class MakeOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            offices: [],
            organizations: [],
            loading: true,
            error: null,
            showForm: false,
            newOrder: {
                office: '',
                organization: '',
                guardAge: '',
                guardSex: '',
                guardStatus: '',
            },
        };
    }

    componentDidMount() {
        // Fetch offices and organizations for the dropdowns
        Promise.all([
            fetch('http://127.0.0.1:8000/api/securityoffice/'),
            fetch('http://127.0.0.1:8000/api/organization/'),
        ])
            .then(([officesRes, orgsRes]) => {
                if (!officesRes.ok || !orgsRes.ok) {
                    throw new Error('Failed to fetch data');
                }
                return Promise.all([officesRes.json(), orgsRes.json()]);
            })
            .then(([officesData, organizationsData]) => {
                this.setState({
                    offices: officesData,
                    organizations: organizationsData,
                    loading: false,
                });
            })
            .catch((error) => this.setState({ error: error.message, loading: false }));
    }

    toggleForm = () => {
        this.setState((prevState) => ({ showForm: !prevState.showForm }));
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newOrder: { ...prevState.newOrder, [name]: value },
        }));
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { newOrder } = this.state;

        // Validate fields
        if (!newOrder.office || !newOrder.organization || !newOrder.guardAge || !newOrder.guardSex || !newOrder.guardStatus) {
            alert('Please fill in all fields!');
            return;
        }

        const payload = {
            Office_name: parseInt(newOrder.office), 
            Organization_name: parseInt(newOrder.organization), 
            guardAge: parseInt(newOrder.guardAge),
            guardSex: newOrder.guardSex,
            guardStatus: newOrder.guardStatus.toUpperCase(), // Ensure uppercase
        };

        console.log('Submitting order:', payload);

        // Sending the POST request to the backend
        fetch('http://127.0.0.1:8000/api/order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        console.error('Backend error:', error);
                        throw new Error(error.detail || 'Failed to create order');
                    });
                }
                return response.json();
            })
            .then((data) => {
                this.setState((prevState) => ({
                    orders: [...prevState.orders, data],
                    showForm: false,
                    newOrder: {
                        office: '',
                        organization: '',
                        guardAge: '',
                        guardSex: '',
                        guardStatus: '',
                    },
                }));
                alert('Order submitted successfully!');
            })
            .catch((error) => {
                console.error('Error submitting order:', error);
                alert(error.message);
            });
    };

    render() {
        const { offices, organizations, loading, error, showForm, newOrder } = this.state;

        return (
            <div className="container">
                <h1 className="mt-5 text-center">Make Order</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button
                    type="button"
                    className="btn btn-primary mb-4"
                    onClick={this.toggleForm}
                    style={{ width: '100%' }}
                >
                    {showForm ? 'Close Form' : 'Create New Order'}
                </button>
                {showForm && (
                    <form onSubmit={this.handleFormSubmit} className="border p-4 rounded shadow-sm bg-light">
                        <div className="form-group mb-3">
                            <label htmlFor="office" className="form-label">Office:</label>
                            <select
                                id="office"
                                name="office"
                                className="form-select"
                                value={newOrder.office}
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
                        <div className="form-group mb-3">
                            <label htmlFor="organization" className="form-label">Organization:</label>
                            <select
                                id="organization"
                                name="organization"
                                className="form-select"
                                value={newOrder.organization}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Organization</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="guardAge" className="form-label">Guard Age:</label>
                            <input
                                type="number"
                                id="guardAge"
                                name="guardAge"
                                className="form-control"
                                value={newOrder.guardAge}
                                onChange={this.handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="guardSex" className="form-label">Guard Sex:</label>
                            <select
                                id="guardSex"
                                name="guardSex"
                                className="form-select"
                                value={newOrder.guardSex}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Sex</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="guardStatus" className="form-label">Guard Status:</label>
                            <select
                                id="guardStatus"
                                name="guardStatus"
                                className="form-select"
                                value={newOrder.guardStatus}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="ORDINARY">Ordinary</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-success w-100 mt-3">
                            Submit Order
                        </button>
                    </form>
                )}
            </div>
        );
    }
}

export default MakeOrder;
