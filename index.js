require('dotenv').config()

const { getRecords, addRecord, delRecord } = require('./route53')
const { getZTMembers } = require('./zerotier')
const { save } = require('./redis')

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
    while (true) {
        console.log(`the thing is running...`)
        console.log('-----------------------')
        console.log()
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
        console.log('generating list of records to add...')
        var memberListDiff = memberList
        for (record of recordList) {
            if (memberListDiff.find(member => member.name == record.name)) {
                console.log(`Found ${record.name}`)
                let deleteMe = memberListDiff.findIndex(member => member.name == record.name)
                memberListDiff.splice(deleteMe, 1)
            }
        }
        if (memberListDiff.length > 0) {
            console.log('Records to add:')
            console.log(memberListDiff)
            for (member of memberListDiff) {
                var result = await addRecord(member.name, member.ip)
                console.log(result)
            }
        } else {
            console.log()
            console.log('No records to add.')
            console.log()
        }

        // get records to delete
        var recordListDiff = recordList
        console.log('generating list of records to delete...')
        for (member of memberListDiff) {
            if (recordListDiff.find(record => record.name == member.name)) {
                
            } else {
                console.log(`Need to delete ${member.name}`)
                let deleteMe = recordListDiff.findIndex(record => record.name == member.name)
                recordListDiff.splice(deleteMe, 1)
            }
        }
        if (recordListDiff.length > 0) {
            console.log('Records to delete:')
            console.log(recordListDiff)
            for (record of recordListDiff) {
                console.log(`deleting ${record}`)
                // var result = await delRecord(member.name, member.ip)
                // console.log(result)
            }
        } else {
            console.log('No records to delete.')
        }

        // sleep
        await sleep(process.env.sleep_timeout)
        console.log()
        console.log()
    }
}

main()