import { createValidation, vd } from 'modusbox-ui-components/dist/redux-validation';

const getAuthValidation = () => ({
  username: createValidation([vd.isRequired]),
  password: createValidation([vd.isRequired]),
});

export { getAuthValidation };
