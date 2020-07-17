function seed(dbName, user, password) {
  db = db.getSiblingDB(dbName);
  db.createUser({
    user: user,
    pwd: password,
    roles: [{ role: 'readWrite', db: dbName }],
  });

  db.createCollection('api_keys');
  // db.createCollection('roles');

  db.api_keys.insert({
    metadata: 'For the first vendor',
    key: 'xCKh5SaPztAX8XAqgqZZQ7Jj',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // db.roles.insertMany([
  //   { code: 'LEARNER', status: true, createdAt: new Date(), updatedAt: new Date() },
  //   { code: 'WRITER', status: true, createdAt: new Date(), updatedAt: new Date() },
  //   { code: 'EDITOR', status: true, createdAt: new Date(), updatedAt: new Date() },
  //   { code: 'ADMIN', status: true, createdAt: new Date(), updatedAt: new Date() },
  // ]);
}

seed('mongo-express-api', 'mongo-express-api-user', 'changeme');
// seed('mongo-express-api-test-db', 'mongo-express-api-user', 'changeme');
