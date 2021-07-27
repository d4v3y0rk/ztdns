const request = require('axios')

module.exports.getZTMembers = function getZTMembers() {
    return new Promise(async (resolve, reject) => {
        var ztOptions = {
            baseURL: 'https://my.zerotier.com',
            url: `/api/network/${process.env.zt_network}/member`,
            headers: { 'Authorization': "bearer " + process.env.zt_api_key }
        }
        
        var ztData = await request(ztOptions)
        var memberList = []
        for (member of ztData.data) {
            var addme = {}
            if (member.name != "") {
                addme.name = member.name.toLowerCase()
            } else {
                addme.name = member.nodeId
            }
            addme.ip = member.config.ipAssignments[0]
            memberList.push(addme)
        }
        resolve(memberList)
    })
}