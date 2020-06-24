const { default: Axios } = require('axios')

require('dotenv').config()
const request = require('axios')
const redis = require("redis")
var AWS = require('aws-sdk')

async function main() {
    const client = redis.createClient()

    client.on("error", function (error) {
        console.error(error)
    })

    AWS.config.accessKeyId = process.env.aws_access_key_id
    AWS.config.secretAccessKey = process.env.aws_secret_access_key

    var route53 = new AWS.Route53()
    var params = {
        Id: process.env.hosted_zone
    }
    route53.getHostedZone(params, function (err, data) {
        if (err) {
            console.log(err, err.stack)
        }
        else {
            console.log(`Got good response from Route53`)
        }
    })

    var ztOptions = {
        baseURL: 'https://my.zerotier.com',
        url: `/api/network/${process.env.zt_network}/member`,
        headers: { 'Authorization': "bearer " + process.env.zt_api_key }
    }
    var ztData = await request(ztOptions)
    for (member of ztData.data) {
        console.log(member.name)
        console.log(member.config.ipAssignments)
    }
}
main()