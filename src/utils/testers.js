import _isEqual from 'lodash/isEqual';

const getAnyIs = value => (...args) => args.some(arg => arg === value);
const getAllAre = value => (...args) => args.every(arg => arg === value);
const getAnyIsDefined = (...args) => args.some(isDefined);

const isDefined = value => value !== undefined;
const isUndefined = value => value === undefined;
const isEqual = (a, b) => _isEqual(a, b);
const isNotEqual = (a, b) => !_isEqual(a, b);
const isNil = value => value === undefined || value === null;
const isNotNil = value => value !== undefined && value !== null;

/*Arrays*/
const isNotEmptyCollection = collection => collection.length > 0;
const not = {};

export {
  getAnyIs,
  getAllAre,
  getAnyIsDefined,
  isNotEqual,
  isDefined,
  isNil,
  isNotNil,
  isUndefined,
  isEqual,
  isNotEmptyCollection,
  not,
};
