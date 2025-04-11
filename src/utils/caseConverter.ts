import { mapKeys, camelCase } from 'lodash';

// ToCamelCase: 객체의 키를 카멜 케이스로 변환
export function ToCamelCase<T extends Record<string, any>>(obj: T): { [K in keyof T as string]: T[K] } {
  return mapKeys(obj, (v, k) => camelCase(k)) as { [K in keyof T as string]: T[K] };
}

// camelToSnake: 카멜 케이스를 스네이크 케이스로 변환
const camelToSnake = (str: string): string => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// setValue: 객체의 키-값 쌍을 SQL 스타일 문자열로 변환
const setValue = <T>(item: Record<string, T>): string => {
  const timeColumn: string = 'TIMESTAMP'; // timeColumn 예시 값, 실제 값으로 대체 필요

  return Object.keys(item)
    .filter((k) => !k.includes('Seq'))
    .map((k) => `${camelToSnake(k)} = '${item[k]}'`)
    .join(',\n    ')
    .replace('timestamp', timeColumn);
};
