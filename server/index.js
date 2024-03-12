const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation
} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async(req, res, next)=> {
  try {
    res.send(await fetchCustomers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/restaurants', async(req, res, next)=> {
  try {
    res.send(await fetchRestaurants());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/reservations', async(req, res, next)=> {
  try {
    res.send(await fetchReservations());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/customers/:customer_id/reservations', async(req, res, next)=> {
  try {
    res.status(201).send(await createReservation({...req.body,...req.params}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next)=> {
  try {
    console.log(req.params.id);
    await destroyReservation(req.params.id);
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [Jake, Lily, David, Margo, BJ, OliveGarden, TasteEurope, KoreanBBQ] = await Promise.all([
    createCustomer('Jake'),
    createCustomer('Lily'),
    createCustomer('David'),
    createCustomer('Margo'),
    createRestaurant('BJ'),
    createRestaurant('OliveGarden'),
    createRestaurant('TasteEurope'),
    createRestaurant('KoreanBBQ')
  ]);
  console.log(`Jake has an id of ${Jake.id}`);
  console.log(`Lily has an id of ${Lily.id}`);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
  await Promise.all([
    createReservation({ customer_id: Jake.id, restaurant_id: BJ.id, date: '04/01/2024', party_count: 3}),
    createReservation({ customer_id: Lily.id, restaurant_id: OliveGarden.id, date: '04/15/2024', party_count: 5}),
    createReservation({ customer_id: David.id, restaurant_id: TasteEurope.id, date: '05/04/2024', party_count: 2}),
    createReservation({ customer_id: Margo.id, restaurant_id: KoreanBBQ.id, date: '05/21/2024', party_count: 6}),
  ]);
  console.log(await fetchReservations());
  const reservations = await fetchReservations();
  console.log(reservations);
  await destroyReservation(reservations[0].id);
  console.log(await fetchReservations());

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();