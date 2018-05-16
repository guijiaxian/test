var host = "zn1.closerhearts.com"

var config = {

  host,

  // 每次启动调用
  loginUrl: `https://${host}/miniprogram/api/login.php`,

  /*// 注册
  registerUrl: `https://${host}/lxCandy/register.php`,

  // 用户信息
  detailsUrl: `https://${host}/lxCandy/details.php`,

  // 账本
  accountUrl: `https://${host}/lxCandy/account.php`,
  */
  // 延续session
  extendSessionUrl: `https://${host}/miniprogram/api/extendSession.php`,

  // 解密群信息
  fetchGroupInfo: `https://${host}/miniprogram/api/fetchGroupInfo.php`,

  // 分享
  shareGroup: `https://${host}/miniprogram/api/shareGroup.php`,

  // 统计分享
  //share: `https://${host}/lxCandy/share.php`,


  //productpage: `https://${host}/order/content/web/28-136-2/index.html?v=12`,
  productpage: `https://${host}/miniprogram/web/13-14-1/index.html?v=3`,
  //productpage: `https://${host}/miniprogram/web/13-1-1/index.html?v=1`,

  appidentifier: '0',
  //appidentifier: '1',
  //appidentifier: '2',
  //appidentifier: '3',


  pay_success: `https://${host}/miniprogram/api/pay/pay_success.php`,
  
  pay_failed: `https://${host}/miniprogram/api/pay/pay_failed.php`,

  pay: `https://${host}/miniprogram/api/pay/jsapi.php`,

  notifyUrl: `https%3A%2F%2F${host}%2Fminiprogram%2Fapi%2Fpay%2Fnotify.php`
};

module.exports = config
