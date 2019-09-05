const is200 = statusCode => statusCode === 200;
const is204 = statusCode => statusCode === 204;
const is400 = statusCode => statusCode === 400;
const is422 = statusCode => statusCode === 422;
const is401 = statusCode => statusCode === 401;
const is404 = statusCode => statusCode === 404;
const is500 = statusCode => statusCode === 500;
const is20x = statusCode => statusCode >= 200 && statusCode <= 299;

export { is200, is204, is20x, is400, is401, is404, is422, is500 };
