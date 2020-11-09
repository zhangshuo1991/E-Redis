const Redis = require('ioredis')
const fs = require('fs')

const redis = new Redis({
  port: 6379, // Redis port
  host: '172.16.30.79', // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: 'dream2020',
  db: 5
})

redis.hgetall('IMG_ICON_CACHE', function (err, dataTwo) {
  for (const p in dataTwo) {
    const params = {
      key: p,
      data: dataTwo[p]
    }
    fs.appendFileSync('IMG_ICON_CACHE.json', JSON.stringify(params) + '\n', {encoding: 'utf-8'})
  }
})

redis.hgetall('IMG_NINE_CACHE', function (err, dataTwo) {
  for (const p in dataTwo) {
    const params = {
      key: p,
      data: dataTwo[p]
    }
    fs.appendFileSync('IMG_NINE_CACHE.json', JSON.stringify(params) + '\n', {encoding: 'utf-8'})
  }
})
