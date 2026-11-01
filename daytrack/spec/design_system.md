# Design System & UI Specifications (DayTrack)

## 1. カラースキーム (AppColors)
DayTrackではダークテーマ/ライトテーマに対応するため、`lib/core/themes/app_colors.dart` に定義された `AppColors` を使用します。直接 `Colors.white` や `Colors.black` などのハードコードは**絶対に避けてください**。

### 主要なカラー定義
*   `AppColors.background`: 画面の主要な背景色（ダークテーマでは黒系）。
*   `AppColors.card`: カードUIやダイアログの背景色。
*   `AppColors.textPrimary`: メインのテキストカラー。
*   `AppColors.textSecondary`: サブテキスト、キャプションのカラー。
*   `AppColors.headerText`: ナビゲーションバーのタイトル色など、アクセント背景上のテキスト。
*   `AppColors.income` / `AppColors.expense`: プラス収支（青系）/マイナス収支（赤系）の専用色。
*   `primaryColor` (`CupertinoTheme.of(context).primaryColor`): アプリのメインテーマカラー（デフォルトはシアン/水色）。ボタンや強調したい箇所、ナビゲーションバーの背景に使用。

## 2. 画面レイアウトの基本構造
iOSライクなUIを実現するため、基本となる画面遷移（Screen）は以下の `CupertinoPageScaffold` の構造を**厳格に守ってください**。

```dart
return CupertinoPageScaffold(
  // 1. NavigationBarの領域を含む画面全体の背景色。
  // 基本的にナビゲーションバーと同じ色（primaryColor）にする。
  backgroundColor: CupertinoTheme.of(context).primaryColor,
  
  navigationBar: CupertinoNavigationBar(
    // 2. 戻るボタンは背景と同化するのを防ぐため、明示的に色を指定する。
    leading: CupertinoNavigationBarBackButton(
      color: AppColors.headerText.resolve(context),
      onPressed: () => Navigator.of(context).pop(),
    ),
    middle: Text(
      'タイトル',
      style: TextStyle(color: AppColors.headerText.resolve(context)),
    ),
    backgroundColor: CupertinoTheme.of(context).primaryColor,
    border: null, // 境界線は消す
  ),
  child: SafeArea(
    // 3. コンテンツ領域は AppColors.background で塗りつぶす。
    // これを忘れると、画面全体が primaryColor (水色) になってしまう。
    child: Container(
      color: AppColors.background.resolve(context),
      child: Column(
        // コンテンツの中身
      ),
    ),
  ),
);
```

## 3. ボタンとインタラクション
*   **CupertinoButton**: 
    *   `primaryColor` などを背景色として指定する場合は、`child: Text()` に対して**必ず** `style: TextStyle(color: CupertinoColors.white)` などの明示的な文字色を指定すること。指定しない場合、背景と同化して見えなくなるバグが発生する。
*   **状態の変化**:
    *   未入力（未記録）であることをユーザーに知らせる場合は、枠線やボタンの色を `CupertinoColors.systemOrange` 等のアクセントカラーにして視覚的フィードバックを与える。
*   **キーボード制御・アンフォーカスUX (Keyboard Dismiss UX)**:
    *   テキスト入力画面（例: 金額入力画面 `AmountInputScreen`）では、入力完了時・保存ボタン押下時、画面破棄時に必ず `FocusManager.instance.primaryFocus?.unfocus()` または `FocusScope.of(context).unfocus()` を呼び出し、画面遷移後にキーボードが残存する不具合を完全に防止すること。
    *   スクロール可能エリア（`ListView` / `CustomScrollView`）には `keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag` を設定し、スクロール操作で自然にキーボードが隠れるようにすること。
    *   画面の余白タップ時にもキーボードが閉じるよう、コンテンツ領域を `GestureDetector`（`behavior: HitTestBehavior.opaque`）でタップ検知してアンフォーカスすること。

## 4. レスポンシブ＆フォルダブル（大画面）対応
*   **ブレークポイント**: 横幅 `600dp` を基準とし、`width >= 600` を大画面（iPhone Duo展開時 / iPad）として扱う。
*   **2ペイン分割**: 大画面時は情報密度を高め、左右分割（Master-Detail）レイアウトを採用する。
*   **折り目（Hinge/Fold）の保護**: `MediaQuery.displayFeatures` を確認し、ヒンジ部に重要なUI（テキスト、ボタン、グラフの中央）が跨がらないようにレイアウトを分割・調整する。

## 5. SNS共有（Xシェア用サマリーカード画像生成）仕様
*   **目的**: ユーザーが日々の収支をX（旧Twitter）へ共有する際、視認性・デザイン性の高いサマリーカード画像を自動生成して添付することで、タイムライン上での拡散力とアプリ認知度（オーガニック流入）を高める。
*   **カードサイズ（横型 16:9 統一）**:
    *   `1200 × 675 px`（16:9比率）。Xのタイムライン・引用リポスト・チャート画像との並列投稿のいずれでも見切れず、収支の数字やすりイラストが最もバランス良く収まる比率に一本化する。
*   **表記とブランド統一ルール**:
    *   カード内の見出しラベルは日本語に統一する（`本日の損益`、`利益`、`損失`、`トレード XX日目`、`ひとことメモ`）。
    *   累計日数（`トレード XX日目`）は、カラーの塗りつぶしバッジではなく、日付テキストと同様に背景色なしのプレーンテキスト（36〜38pt、日付と同等のウェイト・文字色）としてヘッダー右端に配置し、ヘッダー全体の統一感を持たせる。
    *   カード右下には `assets/images/suri_default.png`（すりアイコン）と `made by でいとらっく` の署名を配置する。
    *   カード右ペインにその日のトレード評価（`TradeCondition`）または損益に応じた「すり」の表情イラスト（`suri_happy.png` / `suri_sad.png` 等）を描画する。
*   **レイアウト密度と余白最適化**:
    *   左ペインにメイン損益パネル（高さ295px）と利益・損失の2カラム角丸パネル（コンパクトな高さ120px）を配置し、メイン損益をより高く見やすく、内訳をスマートに収める2ペイン構成とする。右ペインにはすりイラスト・手法タグ・ひとことメモを配置する。
    *   SNSタイムラインおよびホーム画面サムネイルでの視認性を高めるため、日付（38pt）、メモ本文（32pt）など主要タイポグラフィは大きめのフォントサイズを確保する（フッターのブランド署名 `made by でいとらっく` は24ptの控えめなサイズを維持）。
    *   **金額のAuto-fit（省略防止）**: 損益額および利益・損失額は、7桁（百万円単位 `+¥9,999,999`）や高額トレードでも省略記号（`...`）にならず常に全桁が美しく収まるよう、枠幅に応じた動的フォントサイズ自動調整（Auto-fit：損益額は最大74pt〜最小46pt、内訳額は最大42pt〜最小24pt）を適用する。
    *   **0円時のカラー処理（無彩色ルール）**: 収支が0円（ノートレやイーブン等）の際は赤や青のアクセントカラーを付けず、ニュートラルな通常テキスト色（白/ダーク色）および中立な枠線で描画する。内訳の「利益」「損失」欄においても、0円の場合は符号なしの `¥0` とし色を付けない（`textPrimary`）ことで、「損失0円なのに赤文字で表示される」等の誤解や違和感を防ぐ。
    *   メモ未入力時は右ペイン中央にすりイラストを大きく配置し、不自然な余白が生じないオートレイアウトとする。
*   **カスタマイズ＆プレビュー機能 (`ShareCardPreviewModal`)**:
    *   ホーム画面「今日のアクション」内のカードまたは「𝕏 カードを共有する」ボタン押下時にプレビューモーダルを表示し、以下のデザインテーマ（`ShareCardTheme`）をリアルタイムに切り替え・記憶（`SharedPreferences`）可能とする（金額入力画面 `AmountInputScreen` からはX共有ボタンを除外し、入力・保存に専念させる）：
        *   `dark`: ダーク（濃紺ベース×ネオンアクセント、デフォルト）
        *   `light`: ライト（白・アイボリーベース×クリーンデザイン）
        *   `themeColor`: テーマ色（ユーザー設定中のアプリテーマカラーを基調としたポップデザイン）

