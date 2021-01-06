// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      password: 'dev.123',
      host: 'localhost',
      database: 'codenames',
      port: '5432' 
    }
  },

  production: {
    client: 'pg',
    connection: {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      port: process.env.PGPORT 
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};
