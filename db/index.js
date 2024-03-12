const dataBase = {
  event: {
    start: 'Игра началась',
    action: 'Идёт перемещение мяча по полю, игроки и той, и другой команды активно пытаются атаковать',
    freekick: 'Нарушение правил, будет штрафной удар',
    goal: 'Отличный удар! И Г-О-Л!',
    end: 'Игра закончилась. Болельщики довольные расходятся по домам',
  },
  count: 0,
  cache: [],
  listeners: [],

  addNewEvent() {
    const number = Math.floor(Math.random() * 100);
    const result = {
      type: 'action',
      time: Date.now(),
      text: null,
    };
    if (this.count === 51) {
      result.text = this.event.end;
      this.cache.push(result);
      this.listeners.forEach((callback) => callback(result));
      return false;
    }
    if (this.count === 0) {
      result.text = this.event.start;
    } else if (number <= 50) {
      result.text = this.event.action;
    } else if ((number > 50) && (number <= 90)) {
      result.type = 'freekick';
      result.text = this.event.freekick;
    } else {
      result.type = 'goal';
      result.text = this.event.goal;
    }
    this.cache.push(result);
    this.listeners.forEach((callback) => callback(result));
    this.count += 1;
    return true;
  },

  listen(callback) { // Сохраняем callback для отправки сообщения
    this.listeners.push(callback);
  },
};

module.exports = dataBase;
