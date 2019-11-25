import { createValidator, createValidation, vd } from '@modusbox/modusbox-ui-components/dist/redux-validation';

const uniqueNameValidator = (name, isUnique) =>
  createValidator('Hub External CA name name must be unique', () => (name !== undefined ? isUnique : false));
const isRequiredIfNotSet = (depending, value) =>
  createValidator(`Required field when ${depending} is not set`, () => value !== undefined);

export const getHubExternalCaValidators = (name, isNameUnique, rootCertificate, intermediateChain) => {
  const validators = {
    name: createValidation([vd.isRequired, uniqueNameValidator(name, isNameUnique)]),
  };

  if (!rootCertificate) {
    validators.intermediateChain = createValidation([isRequiredIfNotSet('Root Certificate', intermediateChain)]);
  }
  if (!intermediateChain) {
    validators.rootCertificate = createValidation([isRequiredIfNotSet('Intermediate Chain', rootCertificate)]);
  }

  return validators;
};
