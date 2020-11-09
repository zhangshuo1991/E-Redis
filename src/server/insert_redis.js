var readline = require('readline')
const fs = require('fs')
const Redis = require('ioredis')

const redis = new Redis({
  port: 6379, // Redis port
  host: '192.168.1.199', // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: 'Zstx@2019',
  db: 5
})

function fileToRedis (fileName) {
  var fRead = fs.createReadStream(fileName + '.json')
  var objReadline = readline.createInterface({
    input: fRead
  })
  objReadline.on('line', function (line) {
    const IMG_ICON_CACHE = JSON.parse(line)
    redis.hset(fileName, IMG_ICON_CACHE.key, IMG_ICON_CACHE.data)
  })

  objReadline.on('close', function (arr) {
    console.log(arr)
  })
}

fileToRedis('IMG_ICON_CACHE')
fileToRedis('IMG_NINE_CACHE')
