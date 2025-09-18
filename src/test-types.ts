import { FileData, FormatInfo } from './types/index';

// 型定義が正しく動作するかテスト
const testFormatInfo: FormatInfo = {
  format: "JPEG",
  signature: "FF D8 FF",
  description: "JPEG画像ファイル"
};

// これは型エラーになるはず（不正な型）
// const badFormatInfo: FormatInfo = {
//   format: 123,  // string型なのにnumber型を指定
//   signature: "FF D8 FF",
//   description: "JPEG画像ファイル"
// };

console.log('型定義テスト成功:', testFormatInfo);
