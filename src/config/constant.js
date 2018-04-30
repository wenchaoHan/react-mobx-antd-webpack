// 分页设置
export default {
  showTotal: total => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50'],
  showSizeChanger: true,
  showQuickJumper: true,
};

// export const rbacSource = (window.location.host === 'it.beta.wormpex.com' || window.location.host === 'it.corp.bianlifeng.com') ? 'it_integration' : 'ops_integration';
// export const isItSource = (window.location.host === 'it.beta.wormpex.com' || window.location.host === 'it.corp.bianlifeng.com');
export const rbacSource = (window.location.host === 'it.beta.wormpex.com' || window.location.host === 'it.corp.bianlifeng.com') ? 'it_integration' : 'ops_integration';
export const isItSource = (window.location.host === 'it.beta.wormpex.com' || window.location.host === 'it.corp.bianlifeng.com');
export const appSource = 'ticket';
export const urlPrefix = '/ticket/web';
