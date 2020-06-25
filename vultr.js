var request = require('axios')
const qs = require('querystring')

var apiOptions = {
    baseURL: 'https://api.vultr.com/v1/dns',
    headers: {
        'API-Key': process.env.vultr_api_key
    }
}

function getRecords(zone) {
    return new Promise(async (resolve, reject) => {
        apiOptions.url = '/records'
        var result = await request(apiOptions)
        var recordList = []
        for (record of result.data) {
            var addme = {}
            if (record.name.match(/zt/)) {
                addme.name = record.name.split('.')[0]
                addme.ip = record.data
                recordList.push(addme)
            }
        }
        resolve(recordList)
    })
}

module.exports.addRecord = function addRecord(memberName, ip) {
    return new Promise(async (resolve, reject) => {
        var domainName = process.env.vultr_domain_name
        apiOptions.url = '/create_record'
        apiOptions.method = 'POST'
        var params = {
            domain: domainName,
            name: memberName,
            type: 'A',
            data: ip,
            ttl: 300
        }
        apiOptions.data = qs.stringify(params)
        var result = await request(apiOptions)
        if (result.status == 200) {
            resolve('OK')
        } else {
            console.log(result)
            resolve(result.status)
        }
    })
}

module.exports.delRecord = function delRecord(memberName, ip) {
    return new Promise(async (resolve, reject) => {
        // lookup recordId
        var records = await getRecords(process.env.vultr_domain_name)
        var recordId = ""
        var re = new RegExp(memberName,"g");
        for (record of records) {
            if (record.name.match(re)) {
                recordId = record.RECORDID
            }
        }
        // delete record based on recordId
        var domainName = process.env.vultr_domain_name
        apiOptions.url = '/delete_record'
        apiOptions.method = 'POST'
        var params = {
            domain: domainName,
            RECORDID: recordId
        }
        apiOptions.data = qs.stringify(params)
        var result = await request(apiOptions)
        if (result.status == 200) {
            resolve('OK')
        } else {
            console.log(result)
            resolve(result.status)
        }
    })
}

module.exports.getRecords = getRecords