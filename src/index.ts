import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

import { createApp } from './app';

const PORT = process.env.PORT || 7000;

createApp()
  .then(({
           app,
           schema
  }) => {
    const server = http
      .createServer(app.callback());
    server.listen(PORT, () => {
      new SubscriptionServer({
        execute,
        subscribe,
        schema,
      }, {
        server
      });
    });
  })
  .then(() => console.log(`App listening at port: ${PORT}`))
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });
