import { createValidation, createOptionalValidation, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';
import { DNSValidator, IPAddressValidator } from 'App/validators';

const getHubCsrSubjectValidation = () => ({
  commonName: createValidation([vd.isRequired]),
  organization: createValidation([vd.isRequired]),
  organizationUnit: createValidation([vd.isRequired]),
  email: createValidation([vd.isRequired, vd.isEmail]),
  locality: createValidation([vd.isRequired]),
  country: createValidation([vd.isRequired]),
  state: createValidation([vd.isRequired]),
});

const getHubCsrDNSValidation = () => createOptionalValidation([DNSValidator]);
const getHubCsrIPValidation = () => createOptionalValidation([IPAddressValidator]);

export { getHubCsrSubjectValidation, getHubCsrDNSValidation, getHubCsrIPValidation };
