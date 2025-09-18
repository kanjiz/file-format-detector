# ファイル形式検出ツール

> 拡張子を変えても、ファイルの中身は変わりません！実際に確認してみましょう。

## 概要

「ファイル形式検出ツール」は、**拡張子とファイルの実際の内容は別物**であることを体験的に学習できる教育用Webアプリケーションです。

### 学習できること

- 拡張子 ≠ ファイル形式の理解
- ファイルヘッダー（バイナリデータ）の概念
- ハッシュ値による同一性確認

### 想定ユーザー

- IT業界の新人社員
- 非IT系職種でファイル操作が必要な方
- 障害者向け職業訓練での活用

## 使い方

1. **元のファイル**を左側のエリアにドラッグ&ドロップ
2. 同じファイルの**拡張子を変更したファイル**を右側にドラッグ&ドロップ
3. **比較結果**を確認：
   - ファイルサイズ（同じ）
   - MD5ハッシュ（同じ）
   - 実際のファイル形式（同じ）

## ダウンロード

[GitHub Releases](https://github.com/kanjiz/file-format-detector/releases) から最新版の `file-format-detector-vX.X.X.zip` をダウンロードしてください。

### インストール方法

1. zipファイルをダウンロード
2. 展開して `file-format-detector.html` を開く
3. ブラウザで実行（インターネット接続不要）

## 対応ファイル形式

### 画像ファイル

- **JPEG** (.jpg, .jpeg) - `FF D8 FF`
- **PNG** (.png) - `89 50 4E 47`
- **GIF** (.gif) - `47 49 46`
- **BMP** (.bmp) - `42 4D`
- **WebP** (.webp) - `52 49 46 46` + `57 45 42 50`
- **PSD** (.psd) - `38 42 50 53`

### 文書・その他

- **PDF** (.pdf) - `25 50 44 46`
- **ZIP** (.zip) - `50 4B 03` または `50 4B 05`

詳細は [対応形式一覧](docs/file-formats.md) をご覧ください。

## 技術仕様

- **実行環境**: モダンブラウザ（Chrome, Firefox, Safari, Edge）
- **開発環境**: TypeScript + Vite
- **ライブラリ**: CryptoJS（MD5ハッシュ計算）
- **配布形式**: 単一HTMLファイル
- **プライバシー**: ファイルはローカルでのみ処理（サーバー送信なし）

## 開発者向け

### クイックスタート

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

### ドキュメント

- [開発環境構築](docs/development.md)
- [プロジェクト概要](docs/project-overview.md)
- [デプロイ方法](docs/deployment.md)

## 制限事項

- **Adobe Illustrator (.ai)**: PDF形式として判定
- **Microsoft Office (.docx, .xlsx等)**: ZIP形式として判定
- **大容量ファイル**: ブラウザメモリ制限内での動作

これらは教育ツールとしてのシンプルさを重視した設計上の選択です。

## ライセンス

[LICENSE](LICENSE) ファイルをご確認ください。

## コントリビューション

Issue や Pull Request をお待ちしています！

---

**開発・保守**: [GitHub Repository](https://github.com/kanjiz/file-format-detector)
