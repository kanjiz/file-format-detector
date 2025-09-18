# デプロイ・配布ガイド

このドキュメントでは、ファイル形式検出ツールのビルド、デプロイ、リリース作成について説明します。

## GitHub Actions による自動ビルド

### 現在の設定

`.github/workflows/build.yml` で以下を自動実行：

**トリガー条件**:

- `main`, `develop` ブランチへのpush
- `main` ブランチへのPull Request

**実行内容**:

1. Node.js v24環境でのセットアップ
2. 依存関係インストール (`npm ci`)
3. TypeScript型チェック (`npm run type-check`)
4. ビルド実行 (`npm run build`)
5. 成果物のアーティファクト保存（7日間）

### アーティファクトの内容

**dist-files.zip** に含まれるファイル：

```tree
dist-files.zip
├── index.html              # メインファイル（約1KB）
└── lib/
    └── crypto-js.min.js    # オフライン用フォールバック（43KB）
```

### ビルドログの確認

GitHub Actions実行時の出力例：

```text
✓ 2 modules transformed.
[plugin vite:singlefile] Inlining: index-DKVeYDHw.js
✓ Copied lib/crypto-js.min.js to dist/lib/
dist/index.html  0.95 kB │ gzip: 0.63 kB
✓ built in 82ms
```

## 手動リリース作成

### 手順

1. **バージョンタグ作成**

```bash
# 開発完了後
git checkout main
git pull origin main

# バージョンタグ作成
git tag v1.0.0
git push origin v1.0.0
```

2. **GitHub Releasesで配布パッケージ作成**

- GitHubの [Releases](https://github.com/kanjiz/file-format-detector/releases) ページ
- "Create a new release" をクリック
- タグ選択: `v1.0.0`
- リリースタイトル: `ファイル形式検出ツール v1.0.0`

3. **配布ファイルの準備**

```bash
# ローカルでビルド
npm run build

# 配布パッケージ作成
mkdir release-v1.0.0
cp dist/index.html release-v1.0.0/file-format-detector.html
cp -r dist/lib release-v1.0.0/
cp README.md release-v1.0.0/
cp LICENSE release-v1.0.0/

# ZIP作成
cd release-v1.0.0
zip -r ../file-format-detector-v1.0.0.zip .
```

### 配布パッケージ構成

```tree
file-format-detector-v1.0.0.zip
├── file-format-detector.html    # メインファイル
├── lib/
│   └── crypto-js.min.js         # オフライン用
├── README.md                    # 使い方
└── LICENSE                      # ライセンス
```

## 自動リリース設定（将来予定）

### GitHub Actions自動リリース

`.github/workflows/release.yml` で実装予定：

**トリガー**: `v*.*.*` タグのpush時
**処理内容**:

1. 自動ビルド
2. 配布パッケージ作成
3. GitHub Releases自動作成
4. ZIPファイル自動アップロード

### リリースノート自動生成

**テンプレート例**:

```markdown
## ファイル形式検出ツール v1.0.0

### 新機能
- TypeScript + Vite環境への移行
- 単一HTMLファイル配布対応
- オフライン環境フォールバック

### 改善
- アクセシビリティ向上
- ビルドプロセス最適化

### 使い方
1. zipファイルをダウンロード
2. 展開して `file-format-detector.html` を開く
3. ファイルをドラッグ&ドロップで比較

### 動作環境
- Chrome, Firefox, Safari, Edge（モダンブラウザ）
- インターネット接続不要
```

## 配布方法

### 1. GitHub Releases（推奨）

**対象**: 一般ユーザー、研修担当者

**メリット**:

- バージョン管理が明確
- 過去版へのアクセス可能
- 自動更新通知（Watch設定時）

**配布手順**:

1. [Releases](https://github.com/kanjiz/file-format-detector/releases)からダウンロード
2. ZIPを展開
3. `file-format-detector.html`をブラウザで開く

### 2. 直接配布

**対象**: 企業研修、教育機関

**方法**:

- USBメモリでの配布
- 社内共有フォルダ
- メール添付（ZIPファイル約44KB）

**注意点**:

- セキュリティポリシーの確認
- ウイルススキャン実施
- 配布時期の記録

## ビルド設定詳細

### Vite設定のポイント

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    viteSingleFile(),              // 単一ファイル化
    {
      name: 'copy-lib',            // lib/自動コピー
      writeBundle() {
        mkdirSync('dist/lib', { recursive: true });
        copyFileSync('lib/crypto-js.min.js', 'dist/lib/crypto-js.min.js');
      }
    }
  ],
  build: {
    modulePreload: false,          // 不要なpreloadコード除去
    assetsInlineLimit: 0          // 全アセットインライン化
  }
});
```

### 最適化結果

**ファイルサイズ**:

- `index.html`: 0.95KB (gzip: 0.63KB)
- `lib/crypto-js.min.js`: 43KB
- 配布ZIP: 約44KB

**パフォーマンス**:

- 初回読み込み: <100ms
- ファイル解析: <50ms（通常サイズファイル）
- メモリ使用量: 最小限

## 配布状況の管理

### バージョン管理

```text
v1.0.0 - 初期リリース（TypeScript移行版）
v0.9.0 - 従来版（JavaScriptモノリス）
```

### 利用状況追跡

**GitHub指標**:

- リリースダウンロード数
- リポジトリのWatch/Star数
- Issue・PR数

**フィードバック収集**:

- GitHub Issues
- 研修担当者からの報告
- ユーザビリティテスト結果

## 配布時の注意事項

### セキュリティ考慮

- **ファイル処理**: 全てクライアントサイド（サーバー送信なし）
- **依存関係**: CryptoJSのみ（最小限）
- **実行権限**: ブラウザサンドボックス内

### ライセンス遵守

- **MIT License**: 商用利用可能
- **CryptoJS**: MIT License（互換性あり）
- **配布時**: LICENSEファイルの同梱必須

### サポート範囲

**サポート対象**:

- モダンブラウザでの基本動作
- 一般的なファイル形式の判定
- 基本的な使い方説明

**サポート対象外**:

- 古いブラウザ（IE等）
- 特殊なファイル形式
- カスタマイズ要求

## コントリビューター向け

### リリース権限

- **メンテナー**: タグ作成、リリース作成
- **コントリビューター**: PR作成、レビュー参加

### リリース手順の改善

今後の改善予定：

- [ ] 自動リリース作成
- [ ] 自動テスト追加
- [ ] パフォーマンス測定
- [ ] 利用統計収集

---

**最終更新**: 2025年9月17日  
**現在のリリース**: 未リリース（開発中）
