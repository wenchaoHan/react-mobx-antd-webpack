/**
 * 通用上传功能，使用页面 /Common/BatchUpload 统一处理
 * 批量：说的是用文件方式处理多个数据，不是多个文件，好歧义（奇异）的说法。。。
 *
 * config 格式：
 *  具体参考 Common/BatchUpload 和 component/BatchUpload
 *
 * response 格式：
 *  http://wiki.corp.bianlifeng.com/pages/viewpage.action?pageId=11024480
 *
 * 例：
 *    batchUpload({
 *      title: '订单批量导入',
 *      uploadInfo: {
 *        action: '/bach/baseinfo/product/sku/import/v1'
 *      },
 *      templateList: [{
 *        downloadUrl: 'http://127.0.0.1/bach-erp/demo/formFive/',
 *        fileName: 'Sku导入模asff版1.xls',
 *      }, {
 *        downloadUrl: 'http://127.0.0.1/bach-erp/demo/formFive/',
 *        fileName: 'Sku导入模版2.xls',
 *      }],
 *      logInfo: {
 *        bizType: '', // 操作的业务类型
 *        entityCode: '', // 操作的业务主键
 *        opModule: '', // 操作模块
 *      },
 *      responseFilter(res) { // 理论上不应该使用该方法，督促后端把返回格式调整成规范格式
 *        // 返回数据格式化处理，要求返回格式必须符合规范
 *        // http://wiki.corp.bianlifeng.com/pages/viewpage.action?pageId=11024480
 *      },
 *      success(res) {
 *        // 上传成功，刷新页面
 *        location.reload(true);
 *      }
 *    });
 */

import { register } from './opener';
import { stringify } from './url';

export default function batchUpload(config) {
  // 子页面通过opener调用拿到config，直接使用参数和调用函数
  register(() => config, (taskId) => {
    window.open(stringify({
      pathname: '/Common/BatchUpload',
      search: {
        taskId,
      },
    }), window.location.pathname);
  });
}
