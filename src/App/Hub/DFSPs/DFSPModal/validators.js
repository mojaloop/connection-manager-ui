import { createValidation, createValidator, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';

const uniqueNameValidator = (name, isUnique) =>
  createValidator('DFSP name must be unique', () => (name !== undefined ? isUnique : false));

const uniqueIdValidator = (id, isUnique) =>
  createValidator('DFSP ID must be unique', () => (id !== undefined ? isUnique : false));

const getHubDfspModalValidators = (name, isNameUnique, id, isIdUnique) => ({
  name: createValidation([vd.isRequired, uniqueNameValidator(name, isNameUnique)]),
  dfspId: createValidation([vd.isRequired, uniqueIdValidator(id, isIdUnique)]),
});

export { getHubDfspModalValidators };
