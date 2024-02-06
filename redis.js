const redis = require('ioredis');

const clientURL = 'redis://127.0.0.1:6379';

const client = redis.createClient(clientURL);

// client.set('hi', 'there');
// client.get('hi', console.log);

// client.hset('Spanish', 'Red', 'Rojo');
// client.hget('spanish', 'Red', console.log);

client.set('spanish', JSON.stringify({ red: 'rojo' }));
client.get('spanish', (err, val) => console.log(JSON.parse(val)));
// client.get('spanish', 'red', console.log);
