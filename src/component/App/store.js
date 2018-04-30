import { observable, action } from 'mobx';
import Request from 'BizUtils/Request';
import { /* appSource, */ rbacSource } from 'BizConfig/constant';

const reUsername = /\buser_name=([^;]+)/;
const { pathname } = window.location;

const parseUsername = () => {
  const cookie = document.cookie || '';
  const match = cookie.match(reUsername);

  if (match && match[1]) {
    return match[1];
  }

  return null;
};

/**
 * 这里的逻辑是要处理一下：
 * 1. 配置要显示在左侧的导航条为 NAV；
 * 2. NAV 只能有两层，我们只处理两层；
 * 3. 配置要显示的页面为 HTML；
 * 4. HTML 也可以有多层，它对应的是它最近一级节点的父级 NAV；
 *
 * NAV 1
 * ├── NAV 2
 * │   ├── HTML【高亮 NAV 2】
 * │   │   ├── HTML【高亮 NAV 2】
 * │   │   └── HTML【高亮 NAV 2】
 * │   └── HTML【高亮 NAV 2】
 * └── NAV 3
 *     └── NAV 4【无效】
 *         ├── HTML【高亮 NAV 3】
 *         └── HTML【高亮 NAV 3】
 *
 * @param {Array} data rbac 数组
 * @param {Number} level 层级
 */
function parseRbacTree(data, level = 1) {
  if (level > 2) return [];

  const menu = [];
  data.forEach((item) => {
    if (item.showType === 'NAV') {
      const menuItem = {
        name: item.name,
        path: item.path,
        sort: item.sort,
        desc: item.desc,
      };

      if (item.childList) {
        menuItem.children = parseRbacTree(item.childList, level + 1);
      }

      menu.push(menuItem);
    }
  });

  return menu;
}

class AppStore {
  @observable trace = [];
  @observable menu = [];
  @observable select = {};

  @action.bound
  fetchRbac() {
    const username = parseUsername();
    const queryTree = Request.get('/rbac/web/user/queryTree/v1', {
      data: {
        showType: 'NAV',
        appSource: rbacSource,
        userCode: username, //  || 'zongze.li',
      },
    });
    const queryTrace = Request.get('/rbac/internal/queryByPath/v1', {
      data: {
        appSource: rbacSource,
        path: pathname,
        userCode: username, // || 'zongze.li',
      },
    });

    Promise
    .all([queryTree, queryTrace])
    .then(([tree, trace]) => {
      if (tree.data && trace.data) {
        this.trace = this.calculateTrace(trace.data);
        this.select = this.getSelect();
        this.menu = parseRbacTree(tree.data);
      }
    })
    .catch(() => queryTree)
    .then((tree) => {
      if (tree && tree.data) {
        this.menu = parseRbacTree(tree.data);
      }
    });
  }

  calculateTrace(data) {
    let leaf = data;
    const trace = [leaf];
    while (leaf.childList && leaf.childList.length >= 1) {
      leaf = leaf.childList[0];
      trace.push(leaf);
    }

    return trace;
  }

  getSelect() {
    const trace = this.trace;
    if (!trace || !trace.length) return null;
    document.title = trace[trace.length - 1].name;

    if (trace.length >= 2 && trace[1].showType === 'NAV') {
      // 修改 title
      return {
        selectKeys: [trace[1].path],
        openKeys: [trace[0].path],
      };
    }
    return {
      selectKeys: [trace[0].path],
      openKeys: [trace[0].path],
    };
  }
}

const store = new AppStore();

export default store;
