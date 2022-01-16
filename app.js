/*
 * @Author: Advisor
 * @Email: 761324015@qq.com
 * @Module:
 * @Description:
 * @Date: 2021-12-10 15:25:47
 * @LastEditors: Advisor
 * @LastEditTime: 2021-12-10 18:33:02
 */
const Core = require('@alicloud/pop-core');
const Config = require('./config')

const AliClient = new Core({
    accessKeyId: Config.accessKeyId,
    accessKeySecret: Config.accessKeySecret,
    endpoint: 'https://alidns.cn-hangzhou.aliyuncs.com',
    apiVersion: '2015-01-09'
});

const publicIp = require('public-ip');


// 添加云解析记录
function addDomainRecord(params = {}) {
    let requestOption = {
        method: 'POST'
    };
    return new Promise((resolve,reject) => {
        AliClient.request('AddDomainRecord', params, requestOption).then((result) => {
           resolve(result)
        }, (ex) => {
           reject(ex)
        })
    })
}

// 获取云解析列表
function getDomainRecords() {
    let { DomainName } = Config
    let params = {
        DomainName,
    }
    let requestOption = {
        method: 'POST'
    };
    return new Promise((resolve,reject) => {
        AliClient.request('DescribeDomainRecords', params, requestOption).then((result) => {
           resolve(result.DomainRecords.Record)
        }, (ex) => {
           reject(ex)
        })
    })
}

// 更新云解析记录
function updateDomainRecord(params = {}) {
    let requestOption = {
        method: 'POST'
    };
    return new Promise((resolve,reject) => {
        AliClient.request('UpdateDomainRecord', params, requestOption).then((result) => {
           resolve(result)
        }, (ex) => {
           reject(ex)
        })
    })
}

async function task(recordsList,subDomainName,type = 'v4') {
    let { DomainName } = Config
    let typeMap = {'v4':'A','v6':'AAAA'}
     if(subDomainName) {
         console.log('更新的类型:' + type)
        let target = recordsList.find(item => {
            return item.RR === subDomainName
        })
        let targetDomain = `${subDomainName}.${DomainName}`
        // 获取本机ip
        let ip = ''
        if(type === 'v4') {
            ip = await publicIp.v4()
        }else if(type === 'v6') {
            ip = await publicIp.v6()
        }

        console.log(`本机公网ip:${ip}`);

        if(target) {
            let {Value,RecordId,Type,RR} = target
            console.log(`域名:${targetDomain} 阿里记录:${Value}`);
            // 判断ip是否相等
            if(ip === Value) {
                console.log('本机记录与阿里记录一致,无需更新!')
            }else {
                // 修改记录
                await updateDomainRecord({RecordId,Type:typeMap[type],RR,Value:ip})
                console.log(`域名:${targetDomain} 已更新! 值为:${ip}`)
            }
        }else {
            // 添加记录
            console.log(`域名:${targetDomain} 不存在解析记录!`)
            let params = {DomainName,RR:subDomainName,Type:typeMap[type],Value:ip}
            await addDomainRecord(params)
            console.log(`域名:${targetDomain} 已添加! 值为:${ip}`)
        }
     }
}

async function ddns() {
    let { domainList} = Config
    try {
        var recordsList = await getDomainRecords()
    }catch (e) {
        console.log(e)
    }
    for (let i = 0; i < domainList.length; i++) {
        let {type,subDomainName} = domainList[i]
        try {
            await task(recordsList,subDomainName,type)
        }catch (e) {
            console.log(e)
        }
    }
}

//先执行一次
ddns()
setInterval(ddns,Config.intervalTime * 60000)
