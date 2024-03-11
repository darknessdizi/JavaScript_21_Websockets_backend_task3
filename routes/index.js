const combineRouters = require('koa-combine-routers');

const sse = require('./sse');

const router = combineRouters(
  sse,
);

module.exports = router;
