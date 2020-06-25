var Route53 = require('nice-route53')

var r53 = new Route53({
    accessKeyId     : process.env.aws_access_key_id,
    secretAccessKey : process.env.aws_secret_access_key
})

function getZoneName(zoneid) {
    return new Promise((resolve, reject) => {
        r53.zoneInfo(zoneid, function(err, zoneInfo) {
            console.log(zoneInfo.name)
            resolve(zoneInfo.name)
        })
    })
}

module.exports.getRecords = function getRecords(zoneid) {
    return new Promise((resolve, reject) => {
        r53.records(zoneid, function(err, records) {
            resolve(records)
        })
    })
}

module.exports.addRecord = function addRecord(memberName, ip) {
    return new Promise(async (resolve, reject) => {
        var domainName = await getZoneName(process.env.hosted_zone)
        var args = {
            zoneId : process.env.hosted_zone,
            name   : `${memberName}.zt.${domainName}`,
            type   : 'A',
            ttl    : 300,
            values : [
                ip,
            ]
        }
        r53.upsertRecord(args, function(err, res) {
            if (err) {
                resolve(err)
            } else {
                resolve(res)
            }
        })
    })
}

module.exports.delRecord = function delRecord(memberName, ip) {
    return new Promise(async (resolve, reject) => {
        var domainName = await getZoneName(process.env.hosted_zone)
        var args = {
            zoneId : process.env.hosted_zone,
            name   : `${memberName}.zt.${domainName}`,
            type   : 'A',
            ttl    : 300,
            values : [
                ip,
            ]
        }
        r53.delRecord(args, function(err, res) {
            if (err) {
                resolve(err)
            } else {
                resolve(res)
            }
        })
    })
}
