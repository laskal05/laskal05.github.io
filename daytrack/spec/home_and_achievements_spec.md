# Home & Achievements Specification (DayTrack)

## 1. ホーム画面 (HomeTabScreen)
### 1.1. 累計記録（ストリークバッジ）
*   **役割**: アプリを開いて記録するモチベーションの向上。
*   **ロジック**: `DatabaseHelper.instance.getTotalEntryDays()` を呼び出し、重複を除いたユニークな入力日数の合計を計算して表示する。
*   **UI要件**:
    *   0日の場合は非表示 (`SizedBox.shrink()`)。
    *   画面の一番上に配置し、シアン系のグラデーションを用いて目立たせる。
    *   テキスト例：「✨ 累計記録 X日！」

### 1.2. 今日のアクション
*   **役割**: その日の記録を入力・修正するメイン導線。
*   **UI要件**:
    *   未入力時 (`todayEntry == null`): ボタンの色とカードの枠線をオレンジ色にし、視覚的に「未達成」であることを強調する。
    *   入力済時: ボタンの色は `primaryColor`、枠線はなしとし、完了した落ち着きを表現する。
    *   ボタンのテキスト色は必ず**白 (`CupertinoColors.white`)**を指定すること。

### 1.3. 今週の成績（グラフ）
*   **インタラクション**: 棒グラフのバーをタップした際、その日の金額をツールチップで表示する (`barTouchData` の `enabled: true`)。金額はカンマ区切りで表示し、プラスなら青、マイナスなら赤のテキスト色を使用する。

## 2. アチーブメント図鑑画面 (AchievementsScreen)
### 2.1. 画面構造
*   `design_system.md` のルールに従い、`CupertinoPageScaffold` の背景を `primaryColor` に設定し、`SafeArea` 内を `AppColors.background` で塗りつぶす。
*   サマリー部分（達成状況）の背景はコンテンツと同色（または透明）とし、ヘッダーの `primaryColor` とは分離する。
*   戻るボタンの表示には `leading: CupertinoNavigationBarBackButton` を用い、色は `AppColors.headerText` を必ず指定する。

### 2.2. アチーブメント（バッジ）データ
*   **データモデル**: `AchievementBadge` (アイコン、タイトル、進捗テキスト、進捗率、ロック状態)。
*   **判定ロジック（将来実装）**:
    *   例：「ルール遵守1ヶ月」: `DayEntry` の `condition` が `TradeCondition.good` である日数をカウントし、30日に達したらロック解除。

### 2.3. バッジのインタラクション
*   バッジをタップした際は `showCupertinoDialog` を用いて詳細ポップアップを表示する。
*   ポップアップにはアイコン、タイトル、達成状態に応じたメッセージを表示し、「閉じる」ボタンを提供する。
*   右上の「✔︎ 達成」タグは廃止し、メダルアイコンのみで達成状態を表現する（UIのシンプル化）。
