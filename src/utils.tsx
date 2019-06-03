const stringHash = (s: string): number => {
  let hash = 0;
  let i;
  let chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    // tslint:disable-next-line:no-bitwise
    hash = ((hash << 5) - hash) + chr;
    // tslint:disable-next-line:no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const nameToHSL = (name: string) => {
  const hash = stringHash(name);
  const h = hash % 365;
  const s = hash % 100;
  const l = 35;
  return `hsl(${ h }, ${ s }%, ${ l }%)`;
};

export const url = (path: string) => '//log.paotuan.space/' + path;

export const mediaUrl = (path: string) => url('media/' + path);
