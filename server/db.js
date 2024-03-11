const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://localhost/the_acme_reservation_planner_db"
);
const uuid = require("uuid");

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS restaurant;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS reservation;
    
    CREATE TABLE customer(
      id UUID PRIMARY KEY,
      name VARCHAR(100)
    );
    CREATE TABLE restaurant(
      id UUID PRIMARY KEY,
      name VARCHAR(100)
    );
    CREATE TABLE reservation(
      id UUID PRIMARY KEY,
      date DATE,
      party_count INTEGER NOT NULL,
      customer_id UUID REFERENCES customer(id) NOT NULL,
      restaurant_id UUID REFERENCES restaurant(id) NOT NULL,     
    );
      `;
  await client.query(SQL);
};

const createCustomer = async (name) => {
  const SQL = `
        INSERT INTO customer(id, name)
        VALUES($1, $2)
        RETURNING *
      `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createRestaurant = async (name) => {
  const SQL = `
        INSERT INTO restaurant(id, name)
        VALUES($1, $2)
        RETURNING *
      `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
};
