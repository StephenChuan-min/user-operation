import moment from 'moment';
import { GENDER_TYPE, LABEL_TYPE } from '@/static';

/**
 * 去除对象中空值
 * @param obj
 * @returns {*}
 */
const clearEmpty = (obj) => {
  if (typeof obj === 'object') {
    const l = Object.keys(obj);
    const dynamicObj = {
      ...obj,
    };
    l.forEach((item) => {
      if (dynamicObj[item] === '' || dynamicObj[item] === undefined || dynamicObj[item] === null) delete dynamicObj[item];
      else if (typeof dynamicObj[item] === 'string') dynamicObj[item] = dynamicObj[item].replace(/^\s+|\s+$/g, '');
    });
    return dynamicObj;
  }
  return obj;
};

const queryApi = (searchParams) => {
  const params = clearEmpty(searchParams) || {};
  let urlPlus = '';
  Object.keys(params).forEach((key) => {
    urlPlus = `${urlPlus + key}=${params[key]}&`;
  });
  return urlPlus.substring(0, urlPlus.length - 1);
};

const dateUtils = {
  // 时间戳转换为标准日期
  formatStandardDate(timeStamp, format = 'YYYY-MM-DD') {
    return timeStamp === ''
      || timeStamp === '--'
      || timeStamp === undefined
      || timeStamp === null
      ? timeStamp
      : moment(timeStamp).format(format);
  },
};

// 文件下载处理
const fileDownload = (res, isReport = false) => {
  const { data } = res;
  // 创建blob对象
  const blod = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  let fileName;
  if (isReport) {
    // 若是客户报告
    const name = res.request.responseURL.split('name=')[1].split('&startTime')[0];
    fileName = decodeURIComponent(name);
  } else {
    // 从返回数据中获取文件名称
    const str = res.headers['content-disposition'];
    const name = str.split('"')[1];
    if (name) {
      // 由于中文出现乱码 需要转码
      fileName = decodeURIComponent(name).replace(/(.xlsx)/g, '');
    } else {
      const [, a] = str.split('=');
      fileName = a;
    }
  }
  // 创建a标签
  const elink = document.createElement('a');
  elink.style.display = 'none';
  elink.setAttribute('download', fileName);
  elink.href = URL.createObjectURL(blod);
  document.body.appendChild(elink);
  elink.click();
  window.URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink); // 移除a标签
};

const clone = (obj) => {
  let o;
  // 如果  他是对象object的话  , 因为null,object,array  也是'object';
  if (typeof obj === 'object') {
    // 如果  他是空的话
    if (obj === null) {
      o = null;
    } else {
      // 如果  他是数组arr的话
      // eslint-disable-next-line no-lonely-if
      if (obj instanceof Array) {
        o = [];
        for (let i = 0, len = obj.length; i < len; i += 1) {
          o.push(clone(obj[i]));
        }
      } else {
        // 如果  他是对象object的话
        o = {};
        // for (const j in obj) {
        //   o[j] = clone(obj[j]);
        // }
        Object.keys(obj).forEach((j) => {
          o[j] = clone(obj[j]);
        });
      }
    }
  } else {
    o = obj;
  }
  return o;
};

const floatFormat = (str) => {
  const num = parseFloat(str);
  if (Number.isNaN(num) || num <= 0) return '-';
  const result = Number(num.toFixed(2)).toLocaleString();
  if (!result.split('.')[1]) return `${result}.00 元`;
  return `${result} 元`;
};

/* 获取随机字符串 */
const ranStr = (l = 4) => {
  const len = l || 32;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i += 1) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return `_${pwd}`;
};

const dateRange = () => [{
  text: '近一个月及以后',
  value: (() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return [start, new Date(0)];
  })(),
}, {
  text: '近三个月及以后',
  value: (() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return [start, new Date(0)];
  })(),
}, {
  text: '近半年及以后',
  value: (() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    return [start, new Date(0)];
  })(),
}];
/**
 * 将数组对象中的空值变为'-'
 * @param arr
 * @returns {{}[]}
 */
const replaceEmpty = (arr = []) => {
  const fn = (obj = {}) => {
    const newObj = {};
    Object.keys(obj).forEach((i) => newObj[i] = (obj[i] || obj[i] === 0) ? obj[i] : '-');
    return newObj;
  };
  return arr.map((i) => fn(i));
};

const handleObligors = (arr = []) => {
  const dynamicArr = (arr || []).map((i) => {
    const { labelType, gender } = i || {};
    return ({ ...i, labelType: LABEL_TYPE[labelType], gender: GENDER_TYPE[gender] });
  });
  return replaceEmpty(dynamicArr);
};

/**
 * 处理全量权限
 * 代理机构创建时默认不勾选
 * @param arr
 * @returns {{[p: string]: *}[]}
 */
const handlePermissions = (arr = []) => arr.map((i) => ({ ...i, isSelect: i.group !== 'menu_dljg' && i.name !== '业务报告导出' }));

const getCheckedList = (permissions = []) => {
  let list = [];
  const group = ['menu_zcwj', 'menu_zjgc', 'menu_fxjk', 'menu_jyfx', 'menu_ywgl', 'menu_hxcx', 'menu_xxss', 'menu_jjgl', 'menu_dljg'];
  const categoryGroup = [...new Set([...group, ...permissions.map((i) => i.group)])].filter((i) => i);
  categoryGroup.forEach((i) => {
    const arr = permissions.filter((j) => j.group === i) || [];
    const title = (arr[0] || {}).category;
    list = [...list, {
      key: i,
      title,
      children: arr.map((k) => ({ id: k.id, name: k.name, isSelect: k.isSelect })),
    }];
  });
  return list;
};

/**
 * 权限：全选、单选 处理
 * @param list
 * @returns {{}}
 */
const getPermissionsList = (list = []) => {
  const checkLists = {};
  list.forEach((i = {}) => {
    const arr = i.children || [];
    const options = arr.map((j) => j.id) || [];
    const checkedData = arr.filter((j) => j.isSelect).map((k) => k.id) || [];
    checkLists[i.key] = {
      checkAll: options.length === checkedData.length,
      checkedData,
      isIndeterminate: checkedData.length > 0 && checkedData.length < options.length,
      options,
    };
  });
  return checkLists;
};
/**
 * 权限处理
 * @param permissions
 * @param str
 * @returns {[{title:'',child:[]}]}
 */
const recordPermissions = (permissions = [], str) => {
  let list = [];
  const record = str.split(',') || [];
  const filterList = permissions.filter((i) => record.includes((i.id || '').toString())) || [];
  const uniqueGroup = [...new Set(filterList.map((i = {}) => i.category))];
  uniqueGroup.forEach((i) => {
    list = [...list, { title: i, child: filterList.filter((j) => j.category === i).map((k) => k.name) }];
  });
  return list;
};
export {
  clearEmpty,
  queryApi,
  dateUtils,
  fileDownload,
  clone,
  floatFormat,
  ranStr,
  dateRange,
  replaceEmpty,
  handleObligors,
  handlePermissions,
  getCheckedList,
  getPermissionsList,
  recordPermissions,
};
