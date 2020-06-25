const request = require('axios')

module.exports.getZTMembers = function getZTMembers() {
    return new Promise(async (resolve, reject) => {
        var ztOptions = {
            baseURL: 'https://my.zerotier.com',
            url: `/api/network/${process.env.zt_network}/member`,
            headers: { 'Authorization': "bearer " + process.env.zt_api_key }
        }
        var ztData = await request(ztOptions)
        resolve(ztData.data)
    })
}