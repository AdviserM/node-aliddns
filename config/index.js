module.exports = {
    //阿里云网站-访问控制-创建用户，添加权限：管理云解析（DNS）的权限-创建AccessKey，得到accessKeyId和accessKeySecret
    accessKeyId:'',
    accessKeySecret:'',
    intervalTime:1, //ddns更新频率，单位为分钟
    DomainName:'',  //域名 例:baidu.com
    domainList:[
        {subDomainName:'v6',type:'v6'}, //ipv6子域名 相当于v6.baidu.com type值可选 v6与v4
        {subDomainName:'v4',type:'v6'}, //ipv4子域名 相当于v4.baidu.com type值可选 v6与v4
    ],
}
