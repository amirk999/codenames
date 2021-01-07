# Node Codenames Application

## Description
This is a simple codenames application written in Node. It uses a socket connection to display updates to users and comes preseeded with basic words. This application uses Node.js, React and Postgres.

## Installation Instructions
### Development
Simply run `npm i` and then `npm run migrate` to install all required modules and DB tables

### Production Requirements
In a production environment, you will need the following environment variables:
| Variable | Description |
| --- | --- |
| PGUSER | Postgres username |
| PGPASSWORD | Postgres password |
| PGHOST | Postgres hostname |
| PGDATABASE | Postgres name |
| PGPORT | Postgres port |

To migrate the database in a production environment, run the following command:
`db-migrate up -e production`