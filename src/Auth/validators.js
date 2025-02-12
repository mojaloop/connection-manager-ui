import { createValidation, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';

const getAuthValidation = () => ({
  username: createValidation([vd.isRequired]),
  password: createValidation([vd.isRequired]),
});

export { getAuthValidation };
