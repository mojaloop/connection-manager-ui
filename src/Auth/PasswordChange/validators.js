import { createValidation, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';

const getPasswordChangeValidation = () => ({
  oldPassword: createValidation([vd.isRequired]),
  newPassword: createValidation([vd.isRequired]),
  confirmPassword: createValidation([vd.isRequired]),
});

export { getPasswordChangeValidation };
