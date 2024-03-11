const Router = require('koa-router');
const { streamEvents } = require('http-event-stream');
const uuid = require('uuid');
const dataBase = require('../../db');

const router = new Router(); // создали роутер

// определяем для какого метода идет обработка запроса (post/get)
router.get('/sse', async (ctx) => {
  streamEvents(ctx.req, ctx.res, {
    async fetch(lastEventId) { // lastEventId это id пользователя
      console.log('Потеряно соединение с ', lastEventId);
      return [];
    },

    async stream(sse) {
      // Вызывается только один раз
      const id = uuid.v4(); // Присваиваем id для пользователя
      for (let i = 0; i < dataBase.cache.length; i += 1) {
        sse.sendEvent({
          id,
          data: JSON.stringify(dataBase.cache[i]),
        });
      }
      dataBase.listen((item) => { // Сохраняем callback (стрелочную функцию)
        sse.sendEvent({
          id,
          data: JSON.stringify(item),
        });
      });
      return () => {};
    },
  });

  ctx.respond = false;
});

module.exports = router;
