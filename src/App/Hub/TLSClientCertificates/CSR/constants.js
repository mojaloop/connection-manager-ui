const CSR_TYPES = {
  MANUAL: 'MANUAL',
  FILE: 'FILE',
};

const buildCsrTypeOptions = hasCa => [
  { label: 'Manual Entry', value: CSR_TYPES.MANUAL, disabled: !hasCa },
  { label: 'Upload CSR', value: CSR_TYPES.FILE },
];

export { CSR_TYPES, buildCsrTypeOptions };
