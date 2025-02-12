import { createValidation, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';

const getTotpValidation = () => ({
  code: createValidation([vd.isRequired, vd.isLong(6)]),
});

export { getTotpValidation };
