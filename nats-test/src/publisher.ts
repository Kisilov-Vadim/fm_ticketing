import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({id: '123', price: 20, title: 'concert'});
  } catch (err) {
    console.error(err);
  }
})