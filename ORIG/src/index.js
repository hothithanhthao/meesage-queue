import amqp from 'amqplib/callback_api.js'

const sleep = (delay, reason) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (reason === undefined ? resolve() : reject(reason)),
      delay
    )
);

async function init() {
  await sleep(10000);

  amqp.connect('amqp://rabbitmq:5672', (err, connection) => {
    if (err) throw err;
    connection.createChannel(async (err, channel) => {
      if (err) throw err;
      const exchange = 'rabbit'
      const key = 'compse140.o';
      channel.assertExchange(exchange, 'topic',{
        durable: false
      })

      for (let i = 1; i < 4; i++) {
        await sleep(3000)
        const message = `MSG_${i}`;
        channel.publish(exchange, key, Buffer.from(message));
      }
    })
  })

}

init();