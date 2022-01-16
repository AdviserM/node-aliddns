### node-aliddns
动态更新阿里云域名绑定的ip
支持ipv4与ipv6
#### 克隆代码
```shell
    git clone 
    cd node-aliddns
```
#### 修改配置文件
```javascript
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

```
#### 运行
#### 直接运行 需要nodejs环境
```shell
安装依赖
yarn 或者 npm i 
yarn start 或者 npm run start  
```

### dokcer方式运行
```shell
# 构建docker镜像
docker build -t nodeAliddns .
# 启动运行 设置自动重启，断电开机后自动运行
docker run -d --name aliddns --restart=always nodeAliddns
```

#### 觉得有用的话,给个star吧!
