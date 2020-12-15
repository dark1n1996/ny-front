export default class Validator {
  constructor(errors, signupForm, signinForm) {
    this.errors = errors;
    this.signupForm = signupForm;
    this.signinForm = signinForm;
  }

  _validateInputElement(input, errorPlace) {
    if (input.validity.valueMissing) {
      return errorPlace.textContent = this.errors.requiredText;
    }
    if (input.validity.typeMismatch) {
      return errorPlace.textContent = this.errors.requiredEmail;
    }
    if (input.name === 'password' && input.validity.tooShort) {
      return errorPlace.textContent = this.errors.validationLengthPass;
    }
    if (input.value == 'Выберите из списка') {
      return errorPlace.textContent = this.errors.selectInList;
    }
    return errorPlace.textContent = '';
  }

  _validateForm(form, button) {
    button.disabled = !form.checkValidity();
    if (form.checkValidity()) {
      button.classList.remove('form__button_off');
    } else {
      button.classList.add('form__button_off');
    }
  }

  setEventListeners(form) {
    const button = form.querySelector('.form__button');
    form.addEventListener('input', (e) => {
      this._validateInputElement(e.target, e.target.closest('.form__wrapper').querySelector('.form__error'));
      this._validateForm(form, button);
    });
  }

  setServerError(errBlock, err) {
    errBlock.textContent = err;
  }
}
