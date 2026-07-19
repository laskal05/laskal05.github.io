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
