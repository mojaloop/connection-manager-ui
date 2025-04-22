import { createValidation, createValidator, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';

const uniqueNameValidator = (name, isUnique) =>
  createValidator('DFSP name must be unique', () => (name !== undefined ? isUnique : false));

const uniqueIdValidator = (id, isUnique) =>
  createValidator('DFSP ID must be unique', () => (id !== undefined ? isUnique : false));

const emailValidator = (email) =>
  createValidator('Invalid email format', () => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });

const getHubDfspModalValidators = (name, isNameUnique, id, isIdUnique, email) => ({
  name: createValidation([vd.isRequired, uniqueNameValidator(name, isNameUnique)]),
  dfspId: createValidation([vd.isRequired, uniqueIdValidator(id, isIdUnique)]),
  email: createValidation([emailValidator(email)]),
});

export { getHubDfspModalValidators };
