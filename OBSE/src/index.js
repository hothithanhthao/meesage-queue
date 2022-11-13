import amqp from 'amqplib/callback_api.js'
import fs from 'fs';
const FILENAME = '../../../data/data.txt'

const sleep = (delay, reason) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () => (reason === undefined ? resolve() : reject(reason)),
      delay
    )
);

async function init() {
    
  await sleep(4000);

  fs.writeFileSync(FILENAME, '');

  amqp.connect('amqp://rabbitmq:5672', (err, connection) => {
    if (err) throw err;
    connection.createChannel((err, channel) => {
      if (err) throw err;
      const exchange = 'rabbit'
      const topicListen = '#';

      channel.assertExchange(exchange, 'topic',{
        durable: false
      })

      channel.assertQueue(exchange, {exclusive: true }, (err, q) => {
        if (err) throw err;
   
        channel.bindQueue(q.queue, exchange, topicListen);

        channel.consume(q.queue, async (msg) => {
          await sleep(1000);
          const message = `${msg.content.toString()}`;
          const writableMsg = `${new Date().toISOString(Date.now())} ${msg.fields.deliveryTag} ${message} to ${msg.fields.routingKey}\n`

          fs.appendFile(FILENAME, writableMsg, 'utf8',(err) => {
            if (err) throw err;
            console.log('New message received. Writing content to file data.txt')
          });
        })
      })
    })
  })
}

init();