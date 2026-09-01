export function cn(...inputs: (string | number | boolean | undefined | null | { [key: string]: any } | (string | number | boolean | undefined | null | { [key: string]: any })[])[]): string {
  const classes: string[] = [];

  function process(item: any) {
    if (!item) return;
    if (typeof item === 'string' || typeof item === 'number') {
      classes.push(String(item));
    } else if (Array.isArray(item)) {
      item.forEach(process);
    } else if (typeof item === 'object') {
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key) && item[key]) {
          classes.push(key);
        }
      }
    }
  }

  inputs.forEach(process);
  return classes.join(' ');
}
