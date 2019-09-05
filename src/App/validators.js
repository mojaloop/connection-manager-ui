import { createValidator } from 'modusbox-ui-components/dist/redux-validation';

const isNumberBetween = (lower, higher) => value => value !== '' && !isNaN(value) && value >= lower && value <= higher;
const isSubnet = isNumberBetween(0, 32);
const isPort = isNumberBetween(0, 65535);

// Tests for a valida Host
const hostRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
const hostValidator = createValidator('It must be a valid Host', value => value !== undefined && hostRegex.test(value));

// Tests for a valid DNS address
const DNSRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
const DNSValidator = createValidator('It must be a valid DNS', value => value !== undefined && DNSRegex.test(value));

// Tests for a valid HTTP / HTTPS URL
const URLRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const URLValidator = createValidator('It must be a valid URL', value => value !== undefined && URLRegex.test(value));

// Tests for a valid IPv4 Address
const IPRegex = /^(([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|25[0-5]|2[0-4]\d)$/;
const IPAddressValidator = createValidator('It must be a valid IP Address', value => {
  if (!value) {
    return false;
  }
  const [address, subnet] = value.split('/');
  const isValidAddress = IPRegex.test(address);
  const isValidSubnet = subnet === undefined || isSubnet(subnet);
  return isValidAddress && isValidSubnet;
});

const portValidator = createValidator('It must be a valid port / ports range', value => {
  if (!value) {
    return false;
  }
  const ports = value.split('-');
  const isValidPortCount = ports.length === 1 || ports.length === 2;
  const isValidPortNum = ports.every(isPort);
  const isValidPortRange = ports.length === 2 ? parseInt(ports[1]) > parseInt(ports[0]) : true;
  return isValidPortCount && isValidPortNum && isValidPortRange;
});

export { hostValidator, DNSValidator, URLValidator, IPAddressValidator, portValidator };
