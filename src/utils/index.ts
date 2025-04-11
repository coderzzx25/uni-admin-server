import * as bcrypt from 'bcrypt';
/**
 * 将数组转换为树形结构
 * @param resource 数据源
 * @param id 主键
 * @param parentId 父级ID
 * @param children 子级字段
 */
export const initializeTree = <T extends object>(
  resource: T[],
  id: keyof T,
  parentId: keyof T,
  children: string,
): (T & { [K in typeof children]: T[] })[] => {
  // 定义增强类型
  type TreeNode = T & { [K in typeof children]: T[] };

  // 安全类型转换
  const temp: TreeNode[] = JSON.parse(JSON.stringify(resource)) as TreeNode[];
  const tempObj: Record<string, TreeNode> = {};

  // 预处理节点
  for (const item of temp) {
    const key = String(item[id]);
    tempObj[key] = item;

    // 类型安全写入 children
    (item as unknown as Record<string, T[]>)[children] = [];
  }

  // 构建树结构
  const tree: TreeNode[] = [];
  for (const item of temp) {
    const parentKey = String(item[parentId]);

    if (parentKey in tempObj) {
      tempObj[parentKey][children as keyof T].push(item);
    } else {
      tree.push(item);
    }
  }

  // 清理空 children
  const cleanEmptyChildren = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      const hasChildren = node[children as keyof T]?.length;
      // 创建新对象避免修改原引用
      const newNode = { ...node };

      if (hasChildren) {
        // 递归清理子节点
        (newNode as Record<string, unknown>)[children] = cleanEmptyChildren(node[children as keyof T] as TreeNode[]);
      } else {
        // 删除空 children
        delete (newNode as Record<string, unknown>)[children];
      }

      return newNode;
    });
  };

  return cleanEmptyChildren(tree);
};

interface ResourceItem<T = any> {
  [key: string]: any;
  children?: T[];
}
export const initializeLang = <T extends ResourceItem, K extends Extract<keyof T, string>>(
  resource: T[],
  lang: K,
  name: keyof T & string = 'name',
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const resourceItem of resource) {
    function recursive(item: T, key = ''): void {
      let currentKey = key;
      const itemName = item[name];

      if (typeof itemName === 'string') {
        currentKey += currentKey ? `.${itemName}` : itemName;

        const langValue = item[lang];
        if (typeof langValue === 'string') {
          result[currentKey] = langValue;
        }

        if (Array.isArray(item.children)) {
          for (const child of item.children as T[]) {
            recursive(child, currentKey);
          }
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
