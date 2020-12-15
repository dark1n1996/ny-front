export default class Api {
  constructor(config) {
    this.config = config;
  }

  _postRequestSignup(url, method, email, password, name) {
    return fetch(this.config + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });
  }

  _postRequestSignin(url, method, email, password) {
    return fetch(this.config + url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  _getRequestUser(url, method) {
    return fetch(this.config + url, {
      method,
      credentials: 'include',
    });
  }

  _postRequestCreateGift(url, method, name, competence, comment) {
    return fetch(this.config + url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, competence, comment
      }),
    });
  }

  signup(email, password, name) {
    return this._postRequestSignup('signup', 'POST', email, password, name);
  }

  signin(email, password) {
    return this._postRequestSignin('signin', 'POST', email, password);
  }

  getUser() {
    return this._getRequestUser('users/me', 'GET');
  }

  giftStar(name, competence, comment) {
    return this._postRequestCreateGift('donats', 'POST', name, competence, comment);
  }
}

/* .then((res) => {
      console.log(res.status)
      if(res.status === 409) {
        return Promise.reject(`Пользователь с такой электронной почтой уже существует`);
      }
      if(res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка на сервере`);
    })
    .then((data) => {
      console.log(data)
    })
    .catch(err => console.log(err)) */
