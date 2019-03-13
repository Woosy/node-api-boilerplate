const mongoose = require('mongoose')
const util = require('util')
const debug = require('debug')('express-mongoose-es6-rest-api:index')

const config = require('./config')
const logger = require('./winston')

mongoose.Promise = Promise

module.exports = async function initConnection (callback) {
  // connect to mongo db
  const mongoUri = `mongodb://${config.db.user}:${config.db.password}@database:${config.db.port}/${config.db.name}?authSource=admin`
  const mongooseOpt = {
    keepAlive: 1,
    useNewUrlParser: true
  }

  mongoose.set('useCreateIndex', true)
  await mongoose.connect(mongoUri, mongooseOpt).then(() => {
    logger.info('Connected to MongoDB.')
    callback()
  }).catch((err) => {
    logger.error('MongoDB connection failed: ', err)
  })

  // print mongoose logs in dev env
  if (config.node_env === 'development') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
    })
  }
}
