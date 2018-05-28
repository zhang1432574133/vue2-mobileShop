const db = "mongodb://locahost/simle-db";
const mongoose = require('mongoose');

exports.connect = () => {
  // 连接数据库
  mongoose.connect(db);

  let maxConnectTimes = 0

  return new Promise((resolove, reject) => {

    // 增加数据库监听事件
    mongoose.connection.on('disconnected', () => {
      // 进行重连
      console.log('数据库断开')
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        mongoose.connect(db);
      } else {
        reject()
        throw new Error('数据库出现问题，程序无法解决，需人为处理');
      }
    })

    // 数据库出现错误的时候
    mongoose.connection.on('error', err => {
      console.log('数据库错误');
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        mongoose.connect(db);
      } else {
        reject(err)
        throw new Error('数据库出现问题，程序无法解决，需人为处理')
      }
    })
    // 链接打开的时候
    mongoose.connection.once('open', () => {
      console.log("MongoDB Connected successFly!")
    })
  })
}
