/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable security/detect-object-injection */
import knex, { Knex } from 'knex';
import { patchKnex } from 'knex-dynamic-connection';

import config from '../knexfile';
// console.log('dev', process.env.NODE_ENV);

let reader: Knex;
let writer: Knex;
if (process.env.NODE_ENV === 'production') {
  reader = knex(JSON.parse(process.env.KNEX_SLAVE_CONFIG));
  let roundRobinCounter = 0;
  patchKnex(reader as any, originalConfig => {
    roundRobinCounter =
      (roundRobinCounter + 1) % (originalConfig as any).replicas.length;
    return (originalConfig as any).replicas[roundRobinCounter];
  });

  writer = knex(JSON.parse(process.env.KNEX_MASTER_CONFIG));
} else {
  // console.log('dev', config[process.env.NODE_ENV]);
  reader = knex(config[process.env.NODE_ENV]);
  writer = knex(config[process.env.NODE_ENV]);
}
export default reader;
export { writer };
