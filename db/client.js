const environment = process.env.NODE_ENV || 'development';
const knexfile = require('../knexfile')[environment];

const db = require('knex')(knexfile);
const { Model } = require('objection');

Model.knex(db);

module.exports = Model;