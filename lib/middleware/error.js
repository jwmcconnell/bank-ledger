// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = err.status || 500;

  res.status(status);

  // eslint-disable-next-line no-console
  if(process.env.NODE_ENV !== 'test') console.log(err);

  res.send({
    status,
    message: err.message
  });
};
