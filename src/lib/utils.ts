export function parseDateFromId(id: string): Date {
  const match = id.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) {
    return new Date(match[1] + 'T00:00:00');
  }
  return new Date();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function normalizeCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function getCategoryDisplayName(category: string): string {
  const map: Record<string, string> = {
    'front-end': '前端开发',
    'nodejs': 'Node.js',
    'computer-science': '计算机科学',
    'photography': '摄影',
    'shopping': '购物',
    'lift': '生活',
  };
  return map[category] || category;
}

export function getSlugFromId(id: string): string {
  return id.replace(/^(\d{4}-\d{2}-\d{2})-/, '');
}
