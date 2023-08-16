  import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserList.scss';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { PencilFill, TrashFill, Check2Square, XSquare, ExclamationTriangle } from 'react-bootstrap-icons';
import UserModal from './../UserModal/UserModal';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userId: null,
      showSelectButtons: false,
      removeUsersId: [],
      unselectUsers: false,
      showConfirmDialog: false,
    };
    this.ref = React.createRef();
  }

  modalOpen(id) {
    this.setState({ show: true });
    this.setState({ userId: id });
  }

  modalClose = () => {
    this.setState({ show: false });
  }

  removeUserHandler(id) {
    const user = this.props.users.find((user) => {
      return user.id === id
    });
    this.removeUserName = `${user.firstName} ${user.lastName} ${user.middleName}`;
    this.removeUserId = user.id;

    this.setState({ showConfirmDialog: true });
  }

  confirmHadler() {
    const users = this.props.users.filter((user) => {
      return ![this.removeUserId].includes(user.id)
    });

    console.log(users);

    this.props.onUserRemove(users);
    this.setState({ showConfirmDialog: false });
  }

  dontConfirmHandler() {
    this.setState({ showConfirmDialog: false });
  }

  userToggleHandler(userId) {
    const selectedUserRow = this.ref.current.querySelector(`[data-id="${userId}"]`);

    if (!selectedUserRow.dataset.selected || selectedUserRow.dataset.selected === 'false') {
      this.selectUserRow(selectedUserRow, userId);
    } else {
      this.unselectUserRow(selectedUserRow, userId);
    }
  }

  selectUserRow(userRow, userId) {
    this.ref.current.classList.add('_edit');
    userRow.dataset['selected'] = 'true';
    userRow.classList.add('_selected');

    this.setState({ showSelectButtons: true });
    this.setState((state) => {
      const removeUsersId = [...state.removeUsersId];
      removeUsersId.push(userId);
      return { removeUsersId: removeUsersId }
    }, () => {
      this.props.onUsersSelect(true, this.state.removeUsersId);
    });
  }

  unselectUserRow(userRow, userId) {
    userRow.dataset['selected'] = 'false';
    userRow.classList.remove('_selected');

    // if (this.ref.current.querySelectorAll('[data-selected="true"]').length === 0) {
    //   this.cancelSelectUserRow()
    // } else {
    //   if (typeof userId === 'undefined') {
    //     this.setState({ removeUsersId: [] }, () => {
    //       this.props.onUsersSelect(false, this.state.removeUsersId);
    //     });
    //   } else {
    //     this.setState((state) => {
    //       return { removeUsersId: state.removeUsersId.filter((val) => {
    //         return val !== userId
    //       }) }
    //     }, () => {
    //       this.props.onUsersSelect(true, this.state.removeUsersId);
    //     });
    //   }
    // }
  }

  cancelSelectUserRow() {
    // Я предполагаю, что я неправильно все-таки использую state. Ведь из-за
    // него при использовании componentDidMount возникает очень много проблем.
    // Главня из этих проблем - зацикленнось проверок компонента.
    this.ref.current.classList.remove('_edit');
    this.setState({ removeUsersId: [] }, () => {
      this.props.onUsersSelect(false, this.state.removeUsersId);
    })
    this.setState({ showSelectButtons: false });
    this.setState({ unselectUsers: true });
  }

  userSelectAllHandler() {
    const userRows = this.ref.current.querySelectorAll('.UserList__row');
    userRows.forEach((userRow) => {
      this.selectUserRow(userRow, parseInt(userRow.dataset.id));
    })
  }

  userUnselectAllHandler() {
    const userRows = this.ref.current.querySelectorAll('.UserList__row');
    userRows.forEach((userRow) => {
      this.unselectUserRow(userRow);
    })
  }

  userSelectCancelHandler() {
    this.userUnselectAllHandler();
    this.cancelSelectUserRow();
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.unselectUsers || this.props.unselectUsers) {
      this.userSelectCancelHandler();
    }
  }

  render() {
    const users = this.props.users.map((user) => {
      const organisation = this.props.organisations.find((organisation) => {
        return organisation.id === user.organisationId
      });
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName} ${(user.middleName) ? user.middleName : ''}`,
        organisationName: organisation.shortName,
        email: user.email,
      }
    });

    let userList;
    if (users.length > 0) {
      userList = users.map((user) => (
        <tr className="UserList__row" key={user.id} data-id={user.id}>
          <td className="UserList__cell" onClick={() => this.userToggleHandler(user.id)}>{user.name}</td>
          <td className="UserList__cell" onClick={() => this.userToggleHandler(user.id)}>{user.organisationName}</td>
          <td className="UserList__cell" onClick={() => this.userToggleHandler(user.id)}>{user.email}</td>
          <td className="UserList__cell UserList__cell--controls">
            <Button
              className="UserList__button"
              variant="primary"
              size="sm"
              onClick={() => this.modalOpen(user.id)}>
              <PencilFill color="white" />
            </Button>

            <Button
              className="UserList__button"
              variant="danger"
              size="sm"
              onClick={() => this.removeUserHandler(user.id)}>
              <TrashFill color="white" />
            </Button>
          </td>
        </tr>
      ));
    } else {
      userList = (
        <tr>
          <td colSpan="100%" className="text-center">Нет пользователей.</td>
        </tr>
      );
    }

    const selectButtonsClassName = `UserList__select-controls ${this.state.showSelectButtons ? 'd-flex' : 'd-none' }`;


    return (
      <Col className="UserList" ref={this.ref}>
        <Row className={selectButtonsClassName}>
          <Col className="d-flex justify-content-end">
            <Button
              variant="outline-primary"
              className="UserList__select-button"
              size="sm"
              onClick={() => this.userSelectAllHandler()}>
              <Check2Square /> Выбрать всех
            </Button>

            <Button
              variant="outline-primary"
              className="UserList__select-button"
              size="sm"
              onClick={() => this.userUnselectAllHandler()}>
              <XSquare /> Убрать выделение
            </Button>

            <Button
              variant="danger"
              className="UserList__select-button"
              size="sm"
              onClick={() => this.userSelectCancelHandler()}>
              Отмена
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="UserList__header-cell">Пользователь</th>
                  <th className="UserList__header-cell">Организация</th>
                  <th className="UserList__header-cell">E-mail</th>
                  <th className="UserList__header-cell UserList__header-cell--controls"></th>
                </tr>
              </thead>
              <tbody>{userList}</tbody>
            </Table>
          </Col>
        </Row>

        <UserModal
          show={this.state.show}
          mode="edit"
          userId={this.state.userId}
          users={this.props.users}
          organisations={this.props.organisations}
          onUsersChange={this.props.onUsersChange}
          onCloseModal={this.modalClose} />

        <Modal show={this.state.showConfirmDialog}>
          <Modal.Header>
            <Modal.Title className="text-danger"><ExclamationTriangle /> Предупреждение!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Вы действительно хотите удалить пользователя {this.removeUserName}?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={() => this.confirmHadler()}>Продолжить</Button>
            <Button variant="danger" onClick={() => this.dontConfirmHadler()}>Отмена</Button>
          </Modal.Footer>
        </Modal>
      </Col>
    )
  }
}

export default UserList;
