import React, { Component } from 'react';
import './EditForm.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';

class EditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // users: this.props.users,
      // organisations: this.props.orgnisations,
      users: [],
      // organisations: [],
      user: {},
      errors: {},
    }
  }

  async getUser(id) {
    const user = await this.props.users.find((user) => {
      return user.id === id
    });
    return user;
  }

  saveUserHandler(e) {
    e.preventDefault();
    return (_.isEmpty(this.state.errors)) ? this.setUser() : false;
  }

  changeFieldHandler(e) {
    this.setState((state) => {
      return { user: Object.assign({}, state.user, { [e.target.name]: e.target.value }) }
    }, () => {
      this.validation(e.target.name, e.target.dataset.validationType, e.target.required);
    });
  }

  async validation(fieldName, validationType, required = true) {
    switch (validationType) {
      case 'name': {
        // Не проверять поле, если оно пусто и required === false
        if (this.state.user[fieldName] === '' && !required) break;

        const regexp = new RegExp('^([а-яё]+|[a-z]+)$', 'iu');
        if (!regexp.test(this.state.user[fieldName])) {
          this.setErrorMessage({ [fieldName]: 'Поле должно содержать только кириллические или латинские буквы.' });
        } else {
          this.removeErrorMessage(fieldName);
        }

        break;
      }
      case 'email': {
        const regexp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!regexp.test(this.state.user[fieldName])) {
          this.setErrorMessage({ [fieldName]: 'Неверный формат E-mail.' });
        } else {
          this.removeErrorMessage(fieldName);
        }

        break;
      }
      case 'organisationId': {
        if (parseInt(this.state.user.organisationId) > 0 && !this.props.organisations.find((organisation) => {
          return organisation.id === parseInt(this.state.user.organisationId);
        })) {
          this.setErrorMessage({ [fieldName]: 'Такая организация не существует.' });
        } else {
          this.removeErrorMessage(fieldName);
        }

        break;
      }
      default: ;
    }
  }

  setErrorMessage(data) {
    this.setState((state) => {
      return { errors: Object.assign({}, state.errors, data)}
    });
  }

  removeErrorMessage(fieldName) {
    this.setState((state) => {
      const newErrors = {...state.errors};
      delete newErrors[fieldName];
      return { errors: newErrors }
    });
  }

  setUser() {
    console.log('setUser detected!')
    let user = this.state.user;
    let users = this.props.users;
    const organisationId = parseInt(user.organisationId);
    if (this.props.mode === 'add') {
      const lastUserId = (this.props.users.length > 0) ? users[this.props.users.length - 1].id : 0;
      user['id'] = lastUserId + 1;
      user['organisationId'] = organisationId;
      users.push(user);
    } else {
      const newUsers = users.map((_user) => {
        if (_user.id === user.id) {
          user['organisationId'] = organisationId;
          _user = user;
        };
        return _user;
      })
      users = newUsers;
    }

    this.props.onUsersChange(users);
    this.props.onCloseModal();
  }

  async componentDidMount() {
    if (this.props.mode === "edit") {
      const user = await this.getUser(this.props.userId);
      this.setState({ user: user });
    }
  }

  render() {
    let select;
    if (this.props.mode === "add") {
      select = (
        <Form.Select
          name="organisationId"
          onChange={(e) => this.changeFieldHandler(e)}
          isInvalid={(this.state.errors && this.state.errors.organisationId)}
          data-validation-type="organisationId"
          required>
          <option></option>
          {this.props.organisations.map((organisation) => (
            <option value={organisation.id} key={organisation.id}>{organisation.fullName}</option>
          ))}
        </Form.Select>
      );
    } else {
      select = (
        <Form.Select
          name="organisationId"
          onChange={(e) => this.changeFieldHandler(e)}
          isInvalid={(this.state.errors && this.state.errors.organisationId)}
          data-validation-type="organisationId"
          value={(this.state.user.organisationId) ? this.state.user.organisationId : ''}
          required>
          <option></option>
          {this.props.organisations.map((organisation) => (
            <option value={organisation.id} key={organisation.id}>
              {organisation.fullName}
            </option>
          ))}
        </Form.Select>
      );
    }

    return (
      <div className="EditForm">
        <Form className="EditForm-form" onSubmit={(e) => this.saveUserHandler(e)}>
          <Form.Group>
            <Form.Label column>Фамилия</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={(this.state.user.firstName) ? this.state.user.firstName : ''}
              onChange={(e) => this.changeFieldHandler(e)}
              isInvalid={(this.state.errors && this.state.errors.firstName)}
              data-validation-type="name"
              required />
            <Form.Control.Feedback type="invalid">{(this.state.errors) ? this.state.errors.firstName : ''}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group id="lastName">
            <Form.Label column>Имя</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={(this.state.user.lastName) ? this.state.user.lastName : ''}
              onChange={(e) => this.changeFieldHandler(e)}
              isInvalid={(this.state.errors && this.state.errors.lastName)}
              data-validation-type="name"
              required />
            <Form.Control.Feedback type="invalid">{(this.state.errors) ? this.state.errors.lastName : ''}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label column>Отчество</Form.Label>
            <Form.Control
              type="text"
              name="middleName"
              onChange={(e) => this.changeFieldHandler(e)}
              value={(this.state.user.middleName) ? this.state.user.middleName : ''}
              isInvalid={(this.state.errors && this.state.errors.middleName)}
              data-validation-type="name" />
            <Form.Control.Feedback type="invalid">{(this.state.errors) ? this.state.errors.middleName : ''}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label column>Организация</Form.Label>
            {select}
            <Form.Control.Feedback type="invalid">{(this.state.errors) ? this.state.errors.organisationId : ''}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label column>E-mail</Form.Label>
            <Form.Control
              type="text"
              name="email"
              onChange={(e) => this.changeFieldHandler(e)}
              value={(this.state.user.email) ? this.state.user.email : ''}
              isInvalid={(this.state.errors && this.state.errors.email)}
              data-validation-type="email"
              required />
            <Form.Control.Feedback type="invalid">{(this.state.errors) ? this.state.errors.email : ''}</Form.Control.Feedback>
          </Form.Group>

          <Form.Control type="hidden" name="id" value={(this.state.user.id) ? this.state.user.id : ''} />

          <div className="EditForm-buttons d-flex justify-content-center">
            <Button type="submit" variant="primary">Сохранить</Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default EditForm;
