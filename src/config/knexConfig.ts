import knex from 'knex';
import knexConfig from '../../knexfile';

const db = knex (knexConfig.development);

db.migrate
  .latest ()
  .then (() => {
    console.log ('Migrações aplicadas com sucesso!');
  })
  .catch (err => {
    console.error ('Erro ao rodar migrações:', err);
  });

export default db;
