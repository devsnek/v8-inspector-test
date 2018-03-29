'use strict';

const binding = require('bindings')('inspector');
const protocol = require('./protocol.json');

let count = 0;
let lastMessage;
const send = binding.start((m) => {
  lastMessage = JSON.parse(m);
});

const inspector = {};

for (const { domain, commands } of protocol.domains) {
  inspector[domain] = { types: {} };
  for (const command of commands) {
    if (command.experimental)
      continue;
    inspector[domain][command.name] = (params) => {
      send(JSON.stringify({
        id: count++,
        method: `${domain}.${command.name}`,
        params,
      }));
      if (lastMessage !== undefined) {
        const { error, result } = lastMessage;
        lastMessage = undefined;
        if (error) {
          const e = new Error(`${error.message}: ${error.data}`);
          e.code = error.code;
          throw e;
        } else {
          return result;
        }
      }
    };
  }
}

module.exports = inspector;
