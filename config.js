const env = process.env.NODE_ENV || `dev`;

let dev = {
  dbURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
};

let test = {
  dbURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_TEST_NAME}?retryWrites=true&w=majority`,
};

let production = {
  dbURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_PROD_NAME}?retryWrites=true&w=majority`,
};

let delivery2 = {
  dbURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_DELIVERY2_NAME}?retryWrites=true&w=majority`,
};

let config = {
  dev,
  test,
  production,
  delivery2,
};

module.exports = config[env];
