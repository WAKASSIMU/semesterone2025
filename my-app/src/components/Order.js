import React, { Component } from 'react';

class Order extends Component {
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
                Office_name: '',
                Organization_name: '',
                guardAge: '',
                guardSex: '',
                guardStatus: '',
            },
        };
    }

    componentDidMount() {
        // Fetch data from the API for orders, offices, and organizations
        Promise.all([
            fetch('http://127.0.0.1:8000/api/order/'),
            fetch('http://127.0.0.1:8000/api/securityoffice/'),
            fetch('http://127.0.0.1:8000/api/organization/'),
        ])
        .then(([ordersResponse, officesResponse, orgsResponse]) => {
            if (!ordersResponse.ok || !officesResponse.ok || !orgsResponse.ok) {
                throw new Error('Failed to fetch data');
            }
            return Promise.all([ordersResponse.json(), officesResponse.json(), orgsResponse.json()]);
        })
        .then(([ordersData, officesData, orgsData]) => {
            this.setState({
                orders: ordersData,
                offices: officesData,
                organizations: orgsData,
                loading: false,
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
            newOrder: { ...prevState.newOrder, [name]: value },
        }));
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        const { newOrder } = this.state;

        const method = newOrder.id ? 'PUT' : 'POST';
        const url = newOrder.id
            ? `http://127.0.0.1:8000/api/order/${newOrder.id}/`
            : 'http://127.0.0.1:8000/api/order/';

        // Send request to create or update order
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(method === 'POST' ? 'Failed to create order' : 'Failed to update order');
            }
            return response.json();
        })
        .then((data) => {
            // Update state with the new order or updated order
            this.setState((prevState) => ({
                orders: method === 'POST' ? [...prevState.orders, data] : prevState.orders.map(order => order.id === newOrder.id ? data : order),
                showForm: false,
                newOrder: {
                    Office_name: '',
                    Organization_name: '',
                    guardAge: '',
                    guardSex: '',
                    guardStatus: '',
                },
            }));
        })
        .catch((error) => {
            this.setState({ error: error.message });
        });
    };

    handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/api/order/${id}/`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to delete order');
            }
            this.setState((prevState) => ({
                orders: prevState.orders.filter(order => order.id !== id),
            }));
        })
        .catch((error) => {
            this.setState({ error: error.message });
        });
    };

    handleEdit = (order) => {
        this.setState({
            newOrder: { ...order },
            showForm: true,
        });
    };

    render() {
        const { orders, offices, organizations, loading, error, showForm, newOrder } = this.state;

        return (
            <div>
                <h1>Orders</h1>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.toggleForm}
                    style={{ marginBottom: '20px' }}
                >
                    {showForm ? 'Close Form' : 'Add New Order'}
                </button>
                {showForm && (
                    <form onSubmit={this.handleFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="Office_name">Office:</label>
                            <select
                                id="Office_name"
                                name="Office_name"
                                className="form-control"
                                value={newOrder.Office_name}
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
                        <div className="form-group">
                            <label htmlFor="Organization_name">Organization:</label>
                            <select
                                id="Organization_name"
                                name="Organization_name"
                                className="form-control"
                                value={newOrder.Organization_name}
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
                        {/* Guard Age Field */}
                        <div className="form-group">
                            <label htmlFor="guardAge">Guard Age:</label>
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
                        {/* Guard Sex Field */}
                        <div className="form-group">
                            <label htmlFor="guardSex">Guard Sex:</label>
                            <select
                                id="guardSex"
                                name="guardSex"
                                className="form-control"
                                value={newOrder.guardSex}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        {/* Guard Status Field */}
                        <div className="form-group">
                            <label htmlFor="guardStatus">Guard Status:</label>
                            <select
                                id="guardStatus"
                                name="guardStatus"
                                className="form-control"
                                value={newOrder.guardStatus}
                                onChange={this.handleInputChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="ORDINARY">Ordinary</option>
                                <option value="ADVANCED">Advanced</option>
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
                            <th scope="col">Office</th>
                            <th scope="col">Organization</th>
                            <th scope="col">Guard Age</th>
                            <th scope="col">Guard Sex</th>
                            <th scope="col">Guard Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            const office = offices.find((office) => office.id === order.Office_name);
                            const organization = organizations.find((org) => org.id === order.Organization_name);
                            return (
                                <tr key={order.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{office ? office.officename : 'N/A'}</td>
                                    <td>{organization ? organization.name : 'N/A'}</td>
                                    <td>{order.guardAge}</td>
                                    <td>{order.guardSex}</td>
                                    <td>{order.guardStatus}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => this.handleEdit(order)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => this.handleDelete(order.id)}
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

export default Order;
