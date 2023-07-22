import React from 'react';

class RegisterPage extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission here (e.g., send data to the server)
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" onChange={this.handleInputChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" onChange={this.handleInputChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" onChange={this.handleInputChange} />
        </label>
        <button type="submit">Register</button>
      </form>
    );
  }
}

export default RegisterPage;
