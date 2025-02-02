import React, { Component } from 'react';

class SecurityOffices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offices: [],
      loading: true,
      error: null,
      showForm: false,
      newOffice: { officename: '', location: '', status: '' },
      officeToUpdate: null, // Track which office is being updated
    };
  }

  componentDidMount() {
    fetch('http://127.0.0.1:8000/api/securityoffice/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ offices: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  }

  toggleForm = (office = null) => {
    this.setState((prevState) => ({
      showForm: !prevState.showForm,
      officeToUpdate: office ? office : null, // Set office data if updating, else null
      newOffice: office
        ? {
            officename: office.officename,
            location: office.location,
            status: office.status,
          }
        : { officename: '', location: '', status: '' }, // Clear form if adding new office
    }));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newOffice: { ...prevState.newOffice, [name]: value },
    }));
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { newOffice, officeToUpdate } = this.state;

    // If there is an office to update, send a PUT request
    if (officeToUpdate) {
      fetch(`http://127.0.0.1:8000/api/securityoffice/${officeToUpdate.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOffice),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update office');
          }
          return response.json();
        })
        .then((data) => {
          this.setState((prevState) => ({
            offices: prevState.offices.map((office) =>
              office.id === officeToUpdate.id ? data : office
            ),
            showForm: false,
            officeToUpdate: null, // Clear office to update
            newOffice: { officename: '', location: '', status: '' }, // Clear form
          }));
        })
        .catch((error) => {
          this.setState({ error: error.message });
        });
    } else {
      // If no office to update, add a new one
      fetch('http://127.0.0.1:8000/api/securityoffice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOffice),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to add new office');
          }
          return response.json();
        })
        .then((data) => {
          this.setState((prevState) => ({
            offices: [...prevState.offices, data],
            newOffice: { officename: '', location: '', status: '' },
            showForm: false,
          }));
        })
        .catch((error) => {
          console.error('Error adding new office:', error);
          alert('Failed to add new office. Please try again.');
        });
    }
  };

  handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/securityoffice/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete office');
        }
        this.setState((prevState) => ({
          offices: prevState.offices.filter((office) => office.id !== id),
        }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  render() {
    const { offices, loading, error, showForm, newOffice } = this.state;

    return (
      <div>
        <h1>Security Offices</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <button type="button" className="btn btn-primary" onClick={() => this.toggleForm()}>
          {showForm ? 'Close Form' : 'Add'}
        </button>
        {showForm && (
          <form onSubmit={this.handleFormSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label htmlFor="officename">Office Name:</label>
              <input
                type="text"
                id="officename"
                name="officename"
                className="form-control"
                value={newOffice.officename}
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
                value={newOffice.location}
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
                value={newOffice.status}
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
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {offices.map((office, index) => (
              <tr key={office.id}>
                <th scope="row">{index + 1}</th>
                <td>{office.officename}</td>
                <td>{office.location}</td>
                <td>{office.status}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    style={{ marginRight: '10px' }}
                    onClick={() => this.toggleForm(office)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => this.handleDelete(office.id)}
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

export default SecurityOffices;
