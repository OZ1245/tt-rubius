import React, { Component } from 'react';
import './ButtonAddUser.scss';
import Button from 'react-bootstrap/Button';
import { Plus } from 'react-bootstrap-icons';
import UserModal from './../UserModal/UserModal';

class ButtonAddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    }
  }

  modalOpen = () => {
    this.setState({show: true });
  }

  modalClose = () => {
    this.setState({ show: false });
  }

  render() {
    return (
      <div className="ButtonAddUser">
        <Button variant="success" type="button" onClick={this.modalOpen}>
          <Plus color="white" /> Добавить пользователя
        </Button>

        <UserModal
          show={this.state.show}
          mode="add"
          users={this.props.users}
          organisations={this.props.organisations}
          onUsersChange={this.props.onUsersChange}
          onCloseModal={this.modalClose} />
      </div>
    )
  }
}

export default ButtonAddUser;
