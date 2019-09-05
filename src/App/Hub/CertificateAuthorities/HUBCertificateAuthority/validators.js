import { createValidation, vd } from 'modusbox-ui-components/dist/redux-validation';
import { hostValidator } from 'App/validators';

const getHubCaNameValidation = () => ({
  commonName: createValidation([vd.isRequired]),
  organization: createValidation([vd.isRequired]),
});

const getHubCaHostValidation = () => createValidation([vd.isRequired, hostValidator]);

export { getHubCaNameValidation, getHubCaHostValidation };
