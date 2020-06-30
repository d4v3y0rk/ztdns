require('dotenv').config()

const { getRecords, addRecord, delRecord } = require('./route53')
const { getZTMembers } = require('./zerotier')

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function checkAdds(recordList) {
    // get records to add
    console.log('generating list of records to add...')
    var memberListDiff = await getZTMembers()
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
}

async function checkDeletes(memberList) {
    // get records to delete
    var recordListDiff = await getRecords(process.env.hosted_zone)
    console.log('generating list of records to delete...')
    for (member of memberList) {
        if (recordListDiff.find(record => record.name == member.name)) {
            console.log(`Found ${member.name}`)
            let deleteMe = recordListDiff.findIndex(record => record.name == member.name)
            recordListDiff.splice(deleteMe, 1)
        }
    }
    if (recordListDiff.length > 0) {
        console.log('Records to delete:')
        console.log(recordListDiff)
        for (record of recordListDiff) {
            var result = await delRecord(record.name, record.ip)
            console.log(result)
        }
    } else {
        console.log()
        console.log('No records to delete.')
        console.log()
    }
}

async function checkChanges(memberList) {
    //get records to change
    var recordListDiff = await getRecords(process.env.hosted_zone)
    console.log('generating list of records to change...')
    for (member of memberList) {
        if (recordListDiff.find(record => record.name == member.name)) {
            let checkme = recordListDiff.findIndex(record => record.name == member.name)
            if (recordListDiff[checkme].ip == member.ip) {
                recordListDiff.splice(checkme, 1)
            }
        }
    }
    if (recordListDiff.length > 0) {
        console.log('Records to change:')
        console.log(recordListDiff)
        for (record of recordListDiff) {
            var result = await delRecord(record.name, record.ip)
            console.log(result)
        }
        await checkAdds()
    } else {
        console.log()
        console.log('No records to change.')
        console.log()
    }
}

async function main() {
    while (true) {
        console.log(`checking for updates...`)
        console.log('-----------------------')
        console.log()
        // get data from route53 about current zerotier records
        var recordList = await getRecords(process.env.hosted_zone)
        
        // get data from zerotier about current network members
        var memberList = await getZTMembers()
        
        // generate actions
        await checkAdds(recordList)
        await checkDeletes(memberList)
        await checkChanges(memberList)

        // sleep
        await sleep(process.env.sleep_timeout)
        console.log()
        console.log()
    }
}

main()