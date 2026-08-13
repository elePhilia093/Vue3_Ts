/**
 * 将扁平列表转换为树形结构
 * @param list 扁平数据数组
 * @param rootValue 根节点的 parentId 值（通常是 0 或 null）
 */
export function buildTree(list: any[], rootValue: number | null = 0) {
  const map = new Map();
  const tree: any[] = [];

  // 1. 建立映射表并初始化 children
  list.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // 2. 组装树形结构
  list.forEach(item => {
    const node = map.get(item.id);
    const parent = map.get(item.parentId);

    if (parent && item.parentId !== rootValue) {
      // 有父节点且不是根节点，挂载到父节点的 children 下
      parent.children.push(node);
    } else {
      // 没有父节点（即顶级菜单），放入根数组
      tree.push(node);
    }
  });

  return tree;
}