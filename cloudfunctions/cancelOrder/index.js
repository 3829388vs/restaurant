const cloud = require('wx-server-sdk');

cloud.init()
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  try {

      await db.collection('order').where({
        _id: event._id
      })
        .update({
          data: {
            status: "已取消"
          },
        });
    return {
      success: true,
      data: event.data
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
