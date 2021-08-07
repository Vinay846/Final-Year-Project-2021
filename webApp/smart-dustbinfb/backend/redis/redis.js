const redis = require('redis');
const client = redis.createClient({
    host: 'redis-15702.c15.us-east-1-2.ec2.cloud.redislabs.com',
    port: 15702,
    password: 'bu7RZrl4WDgtPIdjwur1sAmVmHiidDAU'
});

client.on('error', err => {
    console.log('Error in redis ' + err);
});
client.on('ready', err => {
    console.log('redis server is On !');
});

const setRedisValue=(key, value, exp)=> {
    return new Promise((resolve, reject) => {
        client.set(key, value, 'EX', exp, function(err){
            if(err){
                reject('Unable to set value to redis')
            }
            resolve('Value is Set');
        });
    })
}

const getRedisValue=(key)=>{
    return new Promise((resolve, reject) => {
        client.get(key, function(err, reply) {
            if(err){
                reject('Unable to get value from redis')
            }
            resolve(reply);
        });
    })
}

module.exports.setRedisValue =setRedisValue;
module.exports.getRedisValue =getRedisValue;
