require('dotenv').config()

const { getRecords, addRecord } = require('./route53')
const { getZTMembers } = require('./zerotier')
const { save } = require('./redis')

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    while (0 == 0) {
        console.log(`the thing is running...`)
        // get data from route53 about current zerotier records
        var records = await getRecords(process.env.hosted_zone)
        var recordList = []
        for (record of records) {
            var addme = {}
            if (record.name.match(/zt/)) {
                addme.name = record.name.split('.')[0]
                addme.ip = record.values[0]
                recordList.push(addme)
            }
        }

        // get data from zerotier about current network members
        var ztData = await getZTMembers()
        var memberList = []
        for (member of ztData) {
            var addme = {}
            addme.name = member.name
            addme.ip = member.config.ipAssignments[0]
            memberList.push(addme)
        }

        // generate actions

        // get records to add
        var recordsToAdd = []
        console.log('Records to add:')
        for (record of recordList) {
            if (memberList.includes(record)) {
                console.log(`Found ${record.name}`)
            } else {
                console.log(`did not find ${record.name}`)
            }
        }

        await sleep(process.env.sleep_timeout)
        recordsToAdd = []
        memberList = []
        // var result = await addRecord(add.name, add.ip)
        // console.log(result)
        console.log()
        console.log()
    }
}

main()