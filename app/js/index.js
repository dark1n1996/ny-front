import Api from './main/Api';
import VALIDATION_ERRORS from './main/errors';
import Validator from './main/Validator';
import Cookies from 'js-cookie';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://жопа';
const popupSignup = document.querySelector('.popup__signup');
const popupGift = document.querySelector('.popup__gift');
const signin = document.querySelector('.signin');
const signup = document.querySelector('.signup');
const header = document.querySelector('header');
const gift = document.querySelector('.gift');
const stars = gift.querySelector('.gift__stars span')
const rules = header.querySelector('.header__rules');
const intro = header.querySelector('.header__intro');
const name = header.querySelector('.header__name')
const signinForm = signin.querySelector('form');
const signupForm = signup.querySelector('form');
const giftForm = gift.querySelector('form');
const api = new Api(url);
const validator = new Validator(VALIDATION_ERRORS, signupForm, signinForm);

console.log(process.env.NODE_ENV)

validator.setEventListeners(signupForm);
validator.setEventListeners(signinForm);
validator.setEventListeners(giftForm);

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('form__span_signup')) {
        signin.classList.remove('signin_off')
        signup.classList.add('signin_off')
    }
    if(e.target.classList.contains('form__span_signin')) {
        signin.classList.add('signin_off')
        signup.classList.remove('signin_off')
    }
    if(e.target.classList.contains('popup__close')) {
        popupSignup.classList.remove('popup_on')
        popupGift.classList.remove('popup_on')
    }
    if(e.target.classList.contains('gift__logout-span')) {
        Cookies.remove('jwt', 'localhost');
        window.location.reload();
    }
})


signupForm.addEventListener('submit', (event) => {
    signup.querySelector('.form__server-error').textContent = '';
    api.signup(signupForm.elements.email.value,
      signupForm.elements.password.value, signupForm.elements.name.value)
      .then((res) => {
        if (res.ok) {
            popupSignup.classList.add('popup_on');
        }
        if (res.status === 409) {
          throw new Error('Пользователь с такой электронной почтой уже существует');
        }
        if (res.status === 500) {
          throw new Error('Ошибка на сервере');
        }
        return res.json();
      })
      .catch((err) => {
        signup.querySelector('.form__server-error').textContent = err;
      });
      signupForm.elements.email.value = ''
      signupForm.elements.password.value = '' 
    event.preventDefault();
});


signinForm.addEventListener('submit', (event) => {
    api.signin(signinForm.elements.email.value, signinForm.elements.password.value)
      .then((res) => {
        if (res.ok) {
          signin.classList.add('signin_off');
          signup.classList.add('signup_off');
          gift.classList.remove('gift_off');
          rules.classList.remove('header__rules_off');
          intro.classList.add('header__intro_off');
          signin.querySelector('.form__server-error').textContent = '';
        }
        if (res.status === 401) {
          throw new Error('Неправильные почта или пароль');
        }
        if (res.status === 500) {
          throw new Error('Ошибка на сервере');
        }
        return res.json();
      })
      .then((data) => {
        const nameArr = data.name.split(' ');
        name.textContent = nameArr[0];
        stars.textContent = data.starsToGiftQuantity;
      })
      .catch((err) => {
        signin.querySelector('.form__server-error').textContent = err;
      });
    event.preventDefault();
  });

api.getUser()
    .then((res) => {
        if (res.ok) {
            signin.classList.add('signin_off');
            signup.classList.add('signup_off');
            gift.classList.remove('gift_off');
            rules.classList.remove('header__rules_off');
            intro.classList.add('header__intro_off');
        }
        if(res.status === 500) {
            throw new Error('Ошибка на сервере');
        }
        if (res.status === 404) {
            throw new Error('Ошибка 404');
        }
        if (res.status === 401) {
            throw new Error('Требуется аутентификация');
        }
        return res.json();
    })
    .then((data) => {
        const nameArr = data.user.name.split(' ');
        name.textContent = nameArr[0];
        stars.textContent = data.user.starsToGiftQuantity;
    })
    .catch((err) => {
        console.log(err)
    })


giftForm.addEventListener('submit', (event) => {
    if(stars.textContent == 0) {
        event.preventDefault();
        return gift.querySelector('.form__server-error').textContent = 'К сожалению, у Вас закончились звезды :('
    }
    api.giftStar(giftForm.elements.name.value, giftForm.elements.competence.value, giftForm.elements.comment.value)
        .then((res) => {
        if (res.ok) {
            popupGift.classList.add('popup_on');
            giftForm.elements.comment.value = '';
            gift.querySelector('.form__server-error').textContent = '';
        }
        return res.json();
        })
        .then((data) => {
            if(data.error) {
                gift.querySelector('.form__server-error').textContent = data.error;
            } else {
                stars.textContent = stars.textContent - 1;
            }
        })
        .catch((err) => {
            gift.querySelector('.form__server-error').textContent = err;
        });
        event.preventDefault();
      });


