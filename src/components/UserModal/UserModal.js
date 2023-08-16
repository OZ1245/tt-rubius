import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import EditForm from './../EditForm/EditForm';

class UserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      mode: this.props.mode,
    }
  }

  modalClose = () => {
    // this.setState({ show: false });
    this.props.onCloseModal();
  }

  componentDidUpdate(_, prevState) {
    if (this.props.show !== prevState.show) {
      this.setState({ show: this.props.show })
    }
  }

  render() {
    const title = (this.state.mode === 'add') ? 'Добавить пользователя' : 'Редактировать пользователя';

    return (
      <Modal className="ButtonAddUser-modal" show={this.state.show} onHide={this.modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <EditForm
            mode={this.state.mode}
            userId={this.props.userId}
            users={this.props.users}
            organisations={this.props.organisations}
            onUsersChange={this.props.onUsersChange}
            onCloseModal={this.props.onCloseModal} />
        </Modal.Body>
      </Modal>
    )
  }
}

export default UserModal;
