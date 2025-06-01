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

export function withOptionalParams(
  url: string,
  params: Record<string, any>,
): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
  return query ? `${url}?${query}` : url;
}

export function getColTimeISO(): string {
  const now = new Date();

  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;

  // Create GMT-5 date by subtracting 5 hours
  const gmt5Date = new Date(utcMs - 5 * 60 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${gmt5Date.getFullYear()}-${pad(gmt5Date.getMonth() + 1)}-${pad(gmt5Date.getDate())}` + 'T' +
    `${pad(gmt5Date.getHours())}:${pad(gmt5Date.getMinutes())}:${pad(gmt5Date.getSeconds())}`;
}
