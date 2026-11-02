import primaryData from './screenshots.json';
import extraData from './extra-screenshots.json';
import pilotData from './pilot-screenshots.json';
export type Screenshot = {file:string; source:string; label?:string; alt?:string; sha256?:string; provenance?:string};
const primary: Record<string,Screenshot> = primaryData;
const extras: Record<string,Screenshot[]> = extraData;
const pilot: Record<string,Screenshot[]> = pilotData;
export function screenshotsFor(id:string): Screenshot[] {
  return pilot[id] ?? [...(primary[id] ? [primary[id]] : []), ...(extras[id] || [])];
}
