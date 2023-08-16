import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup'
import { TrashFill, ExclamationTriangle } from 'react-bootstrap-icons';

class ButtonRemoveUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removeUsersId: this.props.removeUsersId,
      showConfirmDialog: false,
      removeUsers: [],
    };
  }

  getRemoveUsers() {
    const users = this.props.users.filter((user) => {
      return this.props.removeUsersId.includes(user.id);
    });
    this.setState({ removeUsers: users });
  }

  removeUsersHandler() {
    // TODO @ Confirn condition
    // Здесь я могла бы применить простой нативный confirm,
    // но решила, что это будет как-то оторвано от дизайна.
    // Если уж и делаю все с использованием компонентов на Bootstrap 5, то
    // нужно продолжать.
    this.getRemoveUsers();
    this.setState({ showConfirmDialog: true });
  }

  confirmHadler() {
    const users = this.props.users.filter((user) => {
      return !this.props.removeUsersId.includes(user.id)
    })

    this.props.onUsersRemove(users);
    this.setState({ showConfirmDialog: false }, () => {
      this.props.onUnselectUsers();
      // Но можно полностью и не отрубать режим выделения при отмене.
    })
  }

  dontConfirmHadler() {
    this.setState({ showConfirmDialog: false }, () => {
      this.props.onUnselectUsers();
    })
  }

  render() {
    const componentClassName = `ButtonAddUser ${!this.props.show ? 'd-none' : 'd-block'}`
    return (
      <div className={componentClassName}>
        <Button variant="danger" onClick={() => this.removeUsersHandler()}>
          <TrashFill color="white" /> Удалить пользователей
        </Button>

        <Modal show={this.state.showConfirmDialog}>
          <Modal.Header>
            <Modal.Title className="text-danger"><ExclamationTriangle /> Предупреждение!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Вы действительно хотите удалить выбранных пользователей?</p>
            <ListGroup variant="flush">
              {this.state.removeUsers.map((user, i) => (
                <ListGroup.Item key={user.id}>{i+1}) {user.firstName} {user.lastName} {user.middleName}</ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => this.confirmHadler()}>Продолжить</Button>
            <Button variant="danger" onClick={() => this.dontConfirmHadler()}>Отмена</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ButtonRemoveUsers;
