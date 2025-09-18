/**
 * ファイル形式情報を表すインターフェース
 * 
 * ファイルのバイナリシグネチャから検出されたファイル形式の詳細情報を格納します。
 * ファイル形式検出ツールでは、ファイルの先頭バイトから実際の形式を判定し、
 * 拡張子が偽装されていても真のファイル形式を特定できます。
 * 
 * @example
 * ```typescript
 * const formatInfo: FormatInfo = {
 *   format: "JPEG",
 *   signature: "FF D8 FF E0 00 10 4A 46",
 *   description: "JPEG画像ファイル"
 * };
 * ```
 */
export interface FormatInfo {
  /** 
   * ファイル形式名
   * 
   * 検出されたファイルの標準的な形式名。拡張子ではなく、
   * バイナリシグネチャから判定された実際の形式を表します。
   * 
   * @example "JPEG", "PNG", "PDF", "ZIP", "GIF", "BMP", "PSD", "WebP"
   */
  format: string;
  
  /** 
   * ファイルシグネチャ（マジックナンバー）
   * 
   * ファイルの先頭8バイトを16進数表記で表した文字列。
   * スペース区切りで大文字表記されます。ファイル形式の判定に使用されます。
   * 
   * @example "FF D8 FF E0" (JPEG), "89 50 4E 47" (PNG), "25 50 44 46" (PDF)
   */
  signature: string;
  
  /** 
   * ファイル形式の説明文
   * 
   * 日本語でのファイル形式の説明。ユーザーインターフェースでの
   * 表示に使用されます。
   * 
   * @example "JPEG画像ファイル", "PNG画像ファイル", "PDFファイル"
   */
  description: string;
}

/**
 * ファイルデータを表すインターフェース
 * 
 * ドラッグ&ドロップされたファイルの完全な情報を格納します。
 * ブラウザのFileオブジェクト、バイナリデータ、検出されたファイル形式、
 * セキュリティハッシュなどの包括的な情報を含みます。
 * 
 * @example
 * ```typescript
 * const fileData: FileData = {
 *   file: new File(['content'], 'example.jpg'),
 *   arrayBuffer: new ArrayBuffer(1024),
 *   formatInfo: { format: "JPEG", signature: "FF D8 FF", description: "JPEG画像ファイル" },
 *   hash: "d41d8cd98f00b204e9800998ecf8427e"
 * };
 * ```
 */
export interface FileData {
  /** 
   * ブラウザのFileオブジェクト
   * 
   * ドラッグ&ドロップされたファイルの元オブジェクト。
   * ファイル名、サイズ、MIMEタイプなどのメタデータを含みます。
   */
  file: File;
  
  /** 
   * ファイルのバイナリデータ
   * 
   * FileReaderで読み込まれたファイルの生のバイナリデータ。
   * ファイル形式の検出やハッシュ計算に使用されます。
   */
  arrayBuffer: ArrayBuffer;
  
  /** 
   * 検出されたファイル形式情報
   * 
   * バイナリシグネチャから判定された実際のファイル形式。
   * 拡張子が偽装されていても、真の形式を特定できます。
   */
  formatInfo: FormatInfo;
  
  /** 
   * MD5ハッシュ値
   * 
   * ファイルの内容から計算されたMD5ハッシュ値（32文字の16進数文字列）。
   * ファイルの同一性を検証するために使用されます。
   * CryptoJSライブラリが利用できない場合は "利用不可（オフライン環境）" となります。
   * 
   * @example "d41d8cd98f00b204e9800998ecf8427e"
   */
  hash: string;
}

/**
 * 比較結果を表すインターフェース
 * 
 * 2つのファイル間の特定の項目（ファイルサイズ、ハッシュ、形式など）の
 * 比較結果を格納します。比較可能性、一致状態、表示方法を含みます。
 * 
 * @example
 * ```typescript
 * const sizeComparison: ComparisonResult = {
 *   file1Value: 1024,
 *   file2Value: 1024,
 *   isMatch: true,
 *   isAvailable: true,
 *   displayName: "ファイルサイズ",
 *   formatDisplay: (val1, val2) => `${val1}バイト vs ${val2}バイト`
 * };
 * ```
 */
export interface ComparisonResult {
  /** 
   * ファイル1の値
   * 
   * 比較対象となるファイル1から取得された値。
   * 型は比較項目によって異なります（number, string等）。
   */
  file1Value: unknown;
  
  /** 
   * ファイル2の値
   * 
   * 比較対象となるファイル2から取得された値。
   * 型は比較項目によって異なります（number, string等）。
   */
  file2Value: unknown;
  
  /** 
   * 値が一致するかどうか
   * 
   * - `true`: 値が一致している
   * - `false`: 値が異なっている  
   * - `null`: 比較不可能（例：CryptoJSが利用できない場合のMD5ハッシュ）
   */
  isMatch: boolean | null;
  
  /** 
   * この比較項目が利用可能かどうか
   * 
   * 環境やライブラリの可用性によって比較できない項目があります。
   * 例：オフライン環境でのMD5ハッシュ比較
   */
  isAvailable: boolean;
  
  /** 
   * 表示用の名前
   * 
   * UIで表示される比較項目の日本語名。
   * 
   * @example "ファイルサイズ", "MD5ハッシュ", "実際の形式"
   */
  displayName: string;
  
  /** 
   * 表示用フォーマット関数
   * 
   * 2つの値を受け取り、ユーザーに表示するための
   * HTML文字列を生成する関数。
   * 
   * @param val1 - ファイル1の値
   * @param val2 - ファイル2の値
   * @returns HTML形式の比較表示文字列
   * 
   * @example
   * ```typescript
   * formatDisplay: (val1, val2) => `${val1.toLocaleString()}バイト vs ${val2.toLocaleString()}バイト`
   * ```
   */
  formatDisplay: (val1: unknown, val2: unknown) => string;
}

/**
 * 比較項目の定義を表すインターフェース
 * 
 * ファイル比較における各項目（サイズ、ハッシュ、形式など）の
 * 設定と動作を定義します。値の取得方法、表示方法、利用可能性判定を含みます。
 * 
 * @example
 * ```typescript
 * const sizeDefinition: ComparisonDefinition = {
 *   key: 'size',
 *   getValue: (fileData) => fileData.file.size,
 *   displayName: 'ファイルサイズ',
 *   formatDisplay: (val1, val2) => `${val1.toLocaleString()}バイト vs ${val2.toLocaleString()}バイト`
 * };
 * ```
 */
export interface ComparisonDefinition {
  /** 
   * 比較項目のキー
   * 
   * 比較項目を一意に識別する文字列。DOM要素のIDの一部として使用されます。
   * 
   * @example "size", "hash", "format"
   */
  key: string;
  
  /** 
   * ファイルデータから値を取得する関数
   * 
   * FileDataオブジェクトから比較対象となる値を抽出する関数。
   * 
   * @param file - ファイルデータオブジェクト
   * @returns 比較対象の値
   * 
   * @example
   * ```typescript
   * getValue: (fileData) => fileData.file.size  // ファイルサイズを取得
   * getValue: (fileData) => fileData.hash       // MD5ハッシュを取得
   * ```
   */
  getValue: (file: FileData) => unknown;
  
  /** 
   * 比較項目の表示名
   * 
   * ユーザーインターフェースに表示される日本語の項目名。
   * 
   * @example "ファイルサイズ", "MD5ハッシュ", "実際の形式"
   */
  displayName: string;
  
  /** 
   * この比較項目が利用可能かを判定する関数（オプション）
   * 
   * 環境やライブラリの状態に応じて、この比較項目が使用可能かを判定します。
   * 省略された場合は常に利用可能とみなされます。
   * 
   * @returns 利用可能な場合はtrue
   * 
   * @example
   * ```typescript
   * isAvailable: () => typeof CryptoJS !== 'undefined'  // CryptoJSが利用可能か
   * ```
   */
  isAvailable?: () => boolean;
  
  /** 
   * 二つの値を比較表示用文字列に変換する関数
   * 
   * 2つのファイルから取得した値を、ユーザーに分かりやすい
   * HTML形式の比較表示文字列に変換します。
   * 
   * @param val1 - ファイル1の値
   * @param val2 - ファイル2の値  
   * @returns HTML形式の比較表示文字列
   * 
   * @example
   * ```typescript
   * formatDisplay: (val1, val2) => `${val1} vs ${val2}`
   * formatDisplay: (val1, val2) => `
   *   <div style="font-size: 0.7em;">${val1}</div>
   *   <div style="font-size: 0.7em;">${val2}</div>`
   * ```
   */
  formatDisplay: (val1: unknown, val2: unknown) => string;
}

/**
 * 比較メッセージ情報を表すインターフェース
 * 
 * ファイル比較の結果に基づいて表示されるメッセージとスタイル情報を格納します。
 * ファイルが同一の場合は成功メッセージ、異なる場合は警告メッセージが生成されます。
 * 
 * @example
 * ```typescript
 * // ファイルが同一の場合
 * const successMessage: ComparisonMessage = {
 *   message: '<strong>完全に同じファイルです！</strong><br>拡張子を変更しても、ファイルの中身は全く変わっていません。',
 *   background: 'rgba(76, 175, 80, 0.3)'
 * };
 * 
 * // ファイルが異なる場合  
 * const errorMessage: ComparisonMessage = {
 *   message: '<strong>異なるファイルです</strong><br>これらは実際に異なるファイルです。',
 *   background: 'rgba(244, 67, 54, 0.3)'
 * };
 * ```
 */
export interface ComparisonMessage {
  /** 
   * 表示するメッセージ（HTML可）
   * 
   * ユーザーに表示される比較結果のメッセージ。HTML形式で記述でき、
   * strongタグやbrタグなどの基本的なHTMLが使用可能です。
   * 
   * @example 
   * ```
   * '<strong>完全に同じファイルです！</strong><br>拡張子を変更しても、ファイルの中身は全く変わっていません。'
   * '<strong>異なるファイルです</strong><br>これらは実際に異なるファイルです。'
   * ```
   */
  message: string;
  
  /** 
   * 背景色（CSS形式）
   * 
   * メッセージエリアに適用される背景色。CSS color形式で指定します。
   * 成功時は緑系、失敗時は赤系の半透明色が使用されます。
   * 
   * @example 
   * - 成功時: "rgba(76, 175, 80, 0.3)" （緑の半透明）
   * - 失敗時: "rgba(244, 67, 54, 0.3)" （赤の半透明）
   */
  background: string;
}

/**
 * ドラッグ&ドロップイベントのコールバック関数型
 * 
 * ファイルのドラッグ&ドロップ操作時に呼び出される関数の型定義。
 * DragEventオブジェクトを受け取り、ファイルの処理を行います。
 * 
 * @param event - ブラウザのDragEventオブジェクト
 * 
 * @example
 * ```typescript
 * const handleDragOver: DragEventHandler = (event) => {
 *   event.preventDefault();
 *   event.stopPropagation();
 * };
 * 
 * const handleDrop: DragEventHandler = (event) => {
 *   event.preventDefault();
 *   const files = event.dataTransfer?.files;
 *   if (files && files.length > 0) {
 *     processFile(files[0]);
 *   }
 * };
 * ```
 */
export type DragEventHandler = (event: DragEvent) => void;

/**
 * ファイル読み込み完了コールバック関数型
 * 
 * FileReaderによるファイル読み込みが完了した際に呼び出される関数の型定義。
 * ファイルオブジェクト、バイナリデータ、対象エリアIDを受け取ります。
 * 
 * @param file - 読み込まれたFileオブジェクト  
 * @param arrayBuffer - ファイルのバイナリデータ
 * @param areaId - ドロップエリアの識別ID（1または2）
 * 
 * @example
 * ```typescript
 * const handleFileLoad: FileLoadHandler = (file, arrayBuffer, areaId) => {
 *   const formatInfo = detectFileFormat(arrayBuffer);
 *   const hash = calculateMD5(arrayBuffer);
 *   const fileData = { file, arrayBuffer, formatInfo, hash };
 *   
 *   if (areaId === 1) {
 *     setFile1(fileData);
 *   } else {
 *     setFile2(fileData);
 *   }
 * };
 * ```
 */
export type FileLoadHandler = (file: File, arrayBuffer: ArrayBuffer, areaId: number) => void;

/**
 * ファイル形式判定関数型
 * 
 * ファイルのバイナリデータから特定の形式かどうかを判定する関数の型定義。
 * 各ファイル形式（JPEG、PNG、PDF等）に対応する判定関数に使用されます。
 * 
 * @param uint8Array - ファイルの先頭バイトを含むUint8Array
 * @returns 指定した形式の場合はtrue、そうでなければfalse
 * 
 * @example
 * ```typescript
 * // JPEG形式の判定関数
 * const isJPEG: FileFormatDetector = (uint8Array) => {
 *   return uint8Array[0] === 0xFF && 
 *          uint8Array[1] === 0xD8 && 
 *          uint8Array[2] === 0xFF;
 * };
 * 
 * // PNG形式の判定関数  
 * const isPNG: FileFormatDetector = (uint8Array) => {
 *   return uint8Array[0] === 0x89 && 
 *          uint8Array[1] === 0x50 &&
 *          uint8Array[2] === 0x4E && 
 *          uint8Array[3] === 0x47;
 * };
 * ```
 */
export type FileFormatDetector = (uint8Array: Uint8Array) => boolean;
