import { createValidation, vd } from '@pm4ml/mojaloop-payment-manager-ui-components-legacy/dist/redux-validation';

const getHubDfspCsrsCertificateModalUploadValidation = () => ({
  certificate: createValidation([vd.isRequired]),
  hubCAId: createValidation([vd.isRequired]),
});

export { getHubDfspCsrsCertificateModalUploadValidation };
