import amqp from 'amqplib/callback_api.js'

const sleep = (delay, reason) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (reason === undefined ? resolve() : reject(reason)),
      delay
    )
);

async function init() {
  await sleep(4000);

  amqp.connect('amqp://rabbitmq:5672', (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const exchange = 'rabbit'
      const topicListen = 'compse140.o';
      const topicSend = 'compse140.i'

      channel.assertExchange(exchange, 'topic',{
        durable: false
      })



      channel.assertQueue('', {exclusive: true}, (err, q) => {
        if (err) throw err;
        channel.bindQueue(q.queue, exchange, topicListen);
        channel.consume(q.queue, async (msg) => {
          await sleep(1000);
          const message = `Got ${msg.content.toString()}`;
          channel.publish(exchange, topicSend, Buffer.from(message));
        })
      })
    })
  })
}

init();