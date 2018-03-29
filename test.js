'use strict';

const inspector = require('./inspector');

inspector.Runtime.enable();
inspector.Debugger.enable();

const { result: { objectId } } = inspector.Runtime.evaluate({
  expression: 'this',
});

console.log(require('util').inspect(
  inspector.Runtime.getProperties({
    objectId,
    generatePreview: true,
  }).result, { colors: true })
);
