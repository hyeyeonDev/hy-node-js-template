export type NormalizedItem = {
  id: string;
  value: string;
  timestamp: string;
  [key: string]: any; // 유연하게 확장 가능
};

// 전체 요청 데이터 (공통 속성 + items 배열)
export type NormalizedData = {
  schema: string; // 공통 속성
  items: NormalizedItem[]; // 실제 데이터들
};
