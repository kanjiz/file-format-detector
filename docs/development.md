# 開発者向けガイド

このドキュメントでは、ファイル形式検出ツールの開発環境構築から既存コードの移行まで、開発に必要な情報をまとめています。

## 開発環境

### 必要なツール

- **Node.js**: v22以上（推奨: v24）
- **npm**: v10以上
- **Git**: バージョン管理
- **VS Code**: 推奨エディター（TypeScript拡張含む）

### 環境確認

```bash
node --version  # v24.x.x
npm --version   # 11.x.x
git --version   # 2.x.x
```

## セットアップ

### 1. リポジトリクローン

```bash
git clone https://github.com/kanjiz/file-format-detector.git
cd file-format-detector
```

### 2. 依存関係インストール

```bash
npm install
```

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス

## 開発コマンド

```bash
# 開発サーバー（ホットリロード付き）
npm run dev

# TypeScript型チェック
npm run type-check

# 本番ビルド（単一HTMLファイル生成）
npm run build

# ビルド結果のプレビュー
npm run preview
```

## プロジェクト構成

```tree
file-format-detector/
├── src/                         # TypeScriptソースコード
│   ├── main.ts                  # エントリーポイント
│   ├── types/                   # 型定義
│   ├── modules/                 # 機能別モジュール
│   │   ├── file-detector.ts     # ファイル形式検出
│   │   ├── comparison.ts        # 比較ロジック
│   │   ├── ui-manager.ts        # UI制御
│   │   └── drag-drop.ts         # ドラッグ&ドロップ
│   ├── utils/                   # ユーティリティ
│   │   └── crypto.ts           # 暗号化関連
│   └── styles/                  # スタイルシート
│       └── main.css
├── lib/                         # サードパーティライブラリ
│   └── crypto-js.min.js        # オフライン用フォールバック
├── dist/                        # ビルド出力
│   ├── index.html              # 単一HTMLファイル
│   └── lib/                    # フォールバック用
├── docs/                        # ドキュメント
├── .github/workflows/           # GitHub Actions
├── index.html                   # 開発用テンプレート
├── vite.config.js              # Vite設定
├── tsconfig.json               # TypeScript設定
└── package.json                # プロジェクト設定
```

## 既存コードからの移行状況

### 完了済み

- ✅ TypeScript + Vite環境構築
- ✅ 単一HTMLファイル生成（vite-plugin-singlefile）
- ✅ GitHub Actions（ビルド確認）
- ✅ lib/フォルダ自動コピー機能

### 作業中

- 🚧 既存JavaScript（800行）のTypeScript化
- 🚧 機能別モジュール分割
- 🚧 型定義の追加

### 予定

- 📋 UI/UXの改善（アクセシビリティ重視）
- 📋 対応ファイル形式の拡張
- 📋 自動リリース作成

## ビルドシステム

### Vite設定のポイント

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    viteSingleFile(),           // 単一HTMLファイル生成
    copyLibPlugin()            // lib/フォルダ自動コピー
  ],
  build: {
    outDir: 'dist',
    modulePreload: false,      // 不要なpreloadコード除去
    assetsInlineLimit: 0       // 全アセットインライン化
  }
})
```

### ビルド成果物

```tree
dist/
├── index.html              # メインファイル（0.95KB）
└── lib/
    └── crypto-js.min.js    # オフライン環境用（43KB）
```

## テスト

### 手動テスト手順

1. **開発環境**: `npm run dev` でローカル確認
2. **ビルド確認**: `npm run build` で成果物生成
3. **プレビュー**: `npm run preview` でビルド結果確認
4. **型チェック**: `npm run type-check` でTypeScript検証

### CI/CD

GitHub Actionsで以下を自動実行：

- 依存関係インストール
- TypeScript型チェック
- ビルド成功確認
- 成果物のアーティファクト保存（7日間）

## 開発時の注意点

### TypeScript型定義

```typescript
// 例: ファイルデータの型定義
interface FileData {
  file: File;
  arrayBuffer: ArrayBuffer;
  formatInfo: FormatInfo;
  hash: string;
}
```

### CryptoJS使用方法

```typescript
import CryptoJS from 'crypto-js';

// 開発時: npmパッケージを使用
function calculateMD5(arrayBuffer: ArrayBuffer): string {
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
  return CryptoJS.MD5(wordArray).toString();
}
```

### アクセシビリティ配慮

- 大きなフォントサイズ（24px）を維持
- 高コントラスト対応
- スクリーンリーダー対応（aria-label等）
- キーボード操作対応

## 🔧 トラブルシューティング

### よくある問題

**Q: `npm run build` でエラーが出る**

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

**Q: TypeScript型エラーが出る**

```bash
# 型チェックのみ実行
npm run type-check
```

**Q: dist/lib/crypto-js.min.jsが生成されない**

```bash
# lib/フォルダが存在するか確認
ls -la lib/
```

## コントリビューション

### プルリクエスト手順

1. `feature/xxx` ブランチを作成
2. 変更を実装
3. `npm run type-check` と `npm run build` で確認
4. プルリクエスト作成
5. GitHub Actionsのチェック通過を確認

### コードスタイル

- **インデント**: スペース2個
- **改行**: LF
- **文字コード**: UTF-8
- **型注釈**: 必須（`any`は原則禁止）

設定ファイル（`.editorconfig`, `.gitattributes`）により自動適用

---

**更新日**: 2025年9月17日
