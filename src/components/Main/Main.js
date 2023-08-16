import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserList from './../UserList/UserList';
import ButtonAddUser from './../ButtonAddUser/ButtonAddUser';
import ButtonRemoveUsers from './../ButtonRemoveUsers/ButtonRemoveUsers';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      organisations: [],
      buttonRemoveShow: false,
      removeUsersId: [],
      unselectUsers: false,
    }
  }

  async getUsers() {
    const res = await fetch('./data/users.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    return data.users;
  }

  async getOrganisations() {
    const res = await fetch('./data/organisations.json', {
      headers: {
        'Content-Type': 'applications/json',
        'Accept': 'applications/json'
      }
    });
    const data = await res.json();
    return data.organisations;
  }

  updateUsersHandler = (users) => {
    this.setState({ users: users });
  }

  selectUsersHandler = (mode, removeUsersId) => {
    this.setState({ buttonRemoveShow: mode });
    this.setState({ removeUsersId: removeUsersId }, () => {
      this.setState({ unselectUsers: false });
    });
  }

  removeUsersHandler = (users) => {
    this.updateUsersHandler(users);
  }

  unselectUsersHandler = () => {
    this.setState({ unselectUsers: true });
  }

  async componentDidMount() {
    const users = await this.getUsers();
    const organisations = await this.getOrganisations();

    this.setState({
      users: users,
      organisations: organisations,
    });
  }

  render() {
    return (
      <Container className="Main">
        <Row>
          <Col className="d-flex justify-content-start">
            <ButtonAddUser
              users={this.state.users}
              organisations={this.state.organisations}
              onUsersChange={this.updateUsersHandler} />
          </Col>

          <Col className="d-flex justify-content-end">
            <ButtonRemoveUsers
              show={this.state.buttonRemoveShow}
              users={this.state.users}
              removeUsersId={this.state.removeUsersId}
              onUsersRemove={this.removeUsersHandler}
              onUnselectUsers={this.unselectUsersHandler} />
          </Col>
        </Row>

        <Row>
          <UserList
            users={this.state.users}
            organisations={this.state.organisations}
            unselectUsers={this.state.unselectUsers}
            onUsersChange={this.updateUsersHandler}
            onUsersSelect={this.selectUsersHandler}
            onUserRemove={this.removeUsersHandler} />
        </Row>
      </Container>
    )
  }
}

export default Main;
