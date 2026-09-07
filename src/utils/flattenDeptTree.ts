
export function flattenDeptTree(tree: any[]): any[] {
  const result: any[] = []

  const walk = (list: any[]) => {
    list.forEach(item => {
      result.push(item)

      if (item.children && item.children.length > 0) {
        walk(item.children)
      }
    })
  }

  walk(tree)

  return result
}