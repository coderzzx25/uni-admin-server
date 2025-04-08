import * as bcrypt from 'bcrypt';
/**
 * 将数组转换为树形结构
 * @param resource 数据源
 * @param id 主键
 * @param parentId 父级ID
 * @param children 子级字段
 */
export const initializeTree = <T>(resource: T[], id: string, parentId: string, children: string): T[] => {
  const temp = JSON.parse(JSON.stringify(resource)); // 深拷贝

  const tempObj: Record<string, T> = {};

  for (const i in temp) {
    tempObj[temp[i][id]] = temp[i];
  }

  return temp.filter((father: T) => {
    const childArr = temp.filter((child: T) => father[id] === child[parentId]);
    childArr.length && (father[children] = childArr);
    return father[parentId] === 0 || !tempObj[father[parentId]];
  });
};

interface ResourceItem<T = any> {
  [key: string]: any;
  children?: T[];
}
export const initializeLang = <T extends ResourceItem>(
  resource: T[],
  lang: string,
  name = 'name',
): Record<string, string> => {
  const result = {};

  for (let i = 0; i < resource.length; i++) {
    const resourceItem = resource[i];

    function recursive(item: T, key = '') {
      let currentKey = key;

      currentKey += currentKey ? `.${item[name]}` : item[name];

      if (item[lang]) result[currentKey] = item[lang];

      if (item.children?.length && Array.isArray(item.children)) {
        for (let j = 0; j < item.children.length; j++) {
          const child = item.children[j];
          recursive(child, currentKey);
        }
      }
    }

    recursive(resourceItem);
  }

  return result;
};

/**
 * 获取当前时间戳
 * @returns 时间戳
 */
export const getTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * 时间戳转日期
 * @param timestamp 时间戳
 * @returns 日期 YYYY-MM-DD hh:mm
 */
export const timestampToDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  return `${Y}-${M}-${D} ${h}:${m}`;
};

/**
 *  比对密码
 * @param plainText 明文
 * @param encrypted 密文
 * @returns 是否匹配
 */
export const comparePassword = (plainText: string, encrypted: string): boolean => {
  return bcrypt.compareSync(plainText, encrypted);
};

/**
 *  加密密码
 * @param password 明文
 * @returns 密文
 */
export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};
