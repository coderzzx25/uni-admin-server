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
