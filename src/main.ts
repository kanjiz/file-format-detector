console.log('ファイル形式検出ツール - TypeScript版')

// とりあえず動作確認
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main')
  if (main) {
    main.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>TypeScript + Vite 環境が正常に動作しています！</h2>
        <p>これから既存のコードを移行していきます。</p>
      </div>
    `
  }
})
