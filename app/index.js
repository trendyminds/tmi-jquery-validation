const $ = require('jquery');
const parsley = require('parsleyjs');
require('jquery.inputmask');

class Validation {
  constructor ($el) {
    this.$el = $el;

    this.initValidation();
    this.insertFeedbackMessage();
    this.events();
  }

  initValidation () {
    this.$el.parsley({
      trigger: 'input blur',
      validationThreshold: 50,
      errorsWrapper: '<div class="form-validation"></div>',
      errorTemplate: '<label class="form-validation__error"></label>',
      errorsContainer: function (parsleyField) {
        // If a fieldset wraps a group of fields, dump the error message into the dive with a data-validate-errors property
        // Useful for radio buttons/checkboxes
        let fieldSet = parsleyField.$element.closest('fieldset');

        if (fieldSet.length > 0) {
          return fieldSet.find('[data-validate-errors]');
        }

        return parsleyField;
      }
    })

    $('[data-validate-first-name]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-minlength', 2)
      .attr('data-parsley-error-message', 'Please enter your first name');

    $('[data-validate-last-name]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-minlength', 2)
      .attr('data-parsley-error-message', 'Please enter your last name');

    $('[data-validate-email]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-type', 'email')
      .attr('data-parsley-error-message', 'Please enter a valid email');

    $('[data-validate-zip-code]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-minlength', 5)
      .attr('data-parsley-maxlength', 5)
      .attr('data-parsley-type', 'digits')
      .attr('data-parsley-error-message', 'Please enter a zip code')
      .inputmask("99999");

    $('[data-validate-phone]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-pattern', /\([0-9][0-9][0-9]\) [0-9]*-[0-9][0-9][0-9][0-9]/g)
      .attr('data-parsley-error-message', 'Please enter a valid phone number')
      .inputmask("(999) 999-9999");

    $('[data-validate-optional-phone]')
      .inputmask("(999) 999-9999");

    $('[data-validate-optional-phone-with-error]')
      .inputmask("(999) 999-9999")
      .attr('data-parsley-pattern', /\([0-9][0-9][0-9]\) [0-9]*-[0-9][0-9][0-9][0-9]/g)
      .attr('data-parsley-error-message', 'Please enter a valid phone number');

    $('[data-validate-birthdate]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-pattern', /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/g)
      .attr('data-parsley-error-message', 'Please enter a valid date of birth')
      .inputmask("99/99/9999");

    $('[data-validate-date]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-pattern', /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/g)
      .attr('data-parsley-error-message', 'Please enter a valid date')
      .inputmask("99/99/9999");

    $('[data-validate-optional-date]')
      .attr('data-parsley-pattern', /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/g)
      .attr('data-parsley-error-message', 'Please enter a valid date')
      .inputmask("99/99/9999");

    $('[data-validate-birthdate-hyphen]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-pattern', /^(((0)[0-9])|((1)[0-2]))(\-)([0-2][0-9]|(3)[0-1])(\-)\d{4}$/g)
      .attr('data-parsley-error-message', 'Please enter a valid date of birth')
      .inputmask("99-99-9999");

    $('[data-validate-comment]')
      .attr('data-parsley-required', true)
      .attr('data-parsley-minlength', 5)
      .attr('data-parsley-maxlength', 2500);

    window.Parsley.addValidator('fieldLimit', {
      validateString: function (value, requirement) {
        if (value.length <= requirement) {
          return true
        }

        return false
      },
      messages: {
        en: 'This field cannot be more than %s characters long'
      }
    })
  }

  events () {
    $('[data-parsley-field-limit]').on('input', this.calculateRemaining);
  }

  insertFeedbackMessage () {
    $('[data-parsley-field-limit]').each(function (i, el) {
      let allowedCharacters = $(el).data('parsley-field-limit');
      $(el).after(`<label class='form__validation-feedback' data-validate-feedback>You have <span data-validate-feedback-amt>${allowedCharacters}</span> total characters remaining.</label>`);
    })
  }

  calculateRemaining (ev) {
    let $field = $(ev.currentTarget);
    let $feedbackMessage = $field.parent().find('[data-validate-feedback]');
    let $feedbackAmt = $feedbackMessage.find('[data-validate-feedback-amt]');
    let totalCharacters = parseInt($field.data('parsley-field-limit'));
    let characters = $field.val().length;

    $feedbackAmt.text(totalCharacters - characters);

    if (characters > totalCharacters) {
      $feedbackMessage.hide();
    } else {
      $feedbackMessage.show();
    }
  }
}

module.exports = Validation;
