const redis = require("redis")

const client = redis.createClient()

client.on("error", function (error) {
    console.error(error)
})

module.exports.save = function save(list) {
    console.log(`Saving data to redis...`)
}