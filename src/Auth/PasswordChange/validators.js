import { createValidation, vd } from '@modusbox/modusbox-ui-components/dist/redux-validation';

const getPasswordChangeValidation = () => ({
  oldPassword: createValidation([vd.isRequired]),
  newPassword: createValidation([vd.isRequired]),
  confirmPassword: createValidation([vd.isRequired]),
});

export { getPasswordChangeValidation };
