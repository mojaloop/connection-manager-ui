import { createValidation, vd } from 'modusbox-ui-components/dist/redux-validation';
import { portValidator, IPAddressValidator } from 'App/validators';

const getEgressPortValidation = () => createValidation([vd.isRequired, portValidator]);
const getEgressAddressValidation = () => createValidation([vd.isRequired, IPAddressValidator]);

export { getEgressAddressValidation, getEgressPortValidation };
