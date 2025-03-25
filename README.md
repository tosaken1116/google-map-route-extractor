# 🚍 Google Maps Route Extractor Extension

Google マップの乗換案内ページから、**乗車駅・降車駅・路線名・料金**を抽出して、右上に表示＆コピーできる Chrome 拡張です。

## ✨ 特長

- Google マップの「ルート案内」ページにアクセスすると、自動で情報を抽出
- **乗換情報 + 路線名 + 料金** を整形表示
- コピー用のテキストを `textarea` に表示、**自由に編集可能**
- ワンクリックで内容をコピー ✂️
- ルートが変わっても自動で更新（MutationObserver 使用）

## 🔧 使用方法

1. このリポジトリをクローン or zip でダウンロード
2. Chrome の `chrome://extensions/` にアクセス
3. 「デベロッパーモード」を ON にする
4. 「パッケージ化されていない拡張機能を読み込む」 → `dist` or `public` ディレクトリを選択
5. Google マップの乗換ページを開くと右上にパネルが表示されます

## 🧪 開発に使っている技術

- TypeScript
- MutationObserver API
- Clipboard API

---

拡張をもっと便利にしたい場合（CSV エクスポートやお気に入りルート保存など）も、お気軽に相談してください！
