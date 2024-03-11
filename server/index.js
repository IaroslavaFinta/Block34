const { 
    client,
    createTables,
    createCustomer,
    createRestaurant
} = require('./db');

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [moe, lucy, ethyl, rome, nyc, la, paris] = await Promise.all([
    createUser('moe'),
    createUser('lucy'),
    createUser('ethyl'),
    createPlace('rome'),
    createPlace('nyc'),
    createPlace('la'),
    createPlace('paris')
  ]);
  console.log(`moe has an id of ${moe.id}`);
  console.log(`rome has an id of ${rome.id}`);
};

init();