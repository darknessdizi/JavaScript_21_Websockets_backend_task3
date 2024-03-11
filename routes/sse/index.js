const Router = require('koa-router');
const { streamEvents } = require('http-event-stream');
const dataBase = require('../../db');
const uuid = require('uuid');

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
      for (const obj of dataBase.cache) {
        sse.sendEvent({
          id,
          data: JSON.stringify(obj),
        });
      }
      dataBase.listen((item) => { // Сохраняем callback (стрелочную функцию)
        sse.sendEvent({
          id,
          data: JSON.stringify(item),
        });
      });
      return () => {};
    }
  });

  ctx.respond = false;
});

module.exports = router;
