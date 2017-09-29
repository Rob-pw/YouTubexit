const Nes = require('nes');

const address = address => `ws://${address}`;

const createClient = address => new Nes.Client(address);

const registerEvents = function(client) {
  client.onConnect(() => {
    console.log('Connection is up!');
  });

  client.onUpdate(() => {
    console.log(arguments);
  });

  cllient.connect(() => {
    console.log('connect!?');
  });
}

function request(url) {
  const client = createClient(url);

  registerEvents(client);

  client.request('video');
}

request('tK558NP0a2c');