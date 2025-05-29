export function toSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnake);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      acc[snakeKey] = toSnake(obj[key]);
      return acc;
    }, {});
  } else {
    return obj;
  }
}

export function toCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamel);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      acc[camelKey] = toCamel(obj[key]);
      return acc;
    }, {});
  } else {
    return obj;
  }
}

export function toLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatLocalISO(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
