# 広告マネタイズ（AdMob）仕様書

## 1. 広告プレースメントとフォーマット方針
| プレースメント | 画面 | バナー種別 | 備考 |
| :--- | :--- | :--- | :--- |
| `AdPlacement.home` | ホームタブ | 通常 Anchored Adaptive Banner | 日常的に開く画面のため操作性を優先 |
| `AdPlacement.calendar` | カレンダータブ | 通常 Anchored Adaptive Banner | 下部に「＋」ボタン等があるため折りたたみ式は使わない |
| `AdPlacement.stats` | 分析タブ | Collapsible Banner (`collapsible: 'bottom'`) | 閲覧中心の画面のため単価（eCPM）向上を狙う |

## 2. 期限切れ広告（Expired Ads）対策
AdMob ポリシーおよび有効インプレッション計測の仕様に基づき、未表示のまま長時間保持された広告オブジェクトを破棄・再取得する。
*   **リワード広告 (`GoogleMobileAdsAdapter`)**:
    *   ロード完了時刻（`_rewardedAdLoadedAt`）を記録する。
    *   表示時（`showRewardedAd`）またはバックグラウンド復帰時等に、ロードから **55分以上** 経過していた場合は `dispose()` して新規ロードを実行する。
*   **バナー広告 (`BannerAdView`)**:
    *   ロード完了時刻を記録し、フォアグラウンド復帰時（`AppLifecycleState.resumed`）に **55分以上** 経過していた場合は再ロードを行う。

## 3. リワード広告ユニットIDのプレースメント分離
*   `AdPlacement.home`（明日への一言ロック解除）と `AdPlacement.stats`（ヒートマップロック解除）で、独立して Ad Unit ID を解決できるようにする。
*   ※ AdMob コンソールでホーム用ユニットIDを新規発行するまでは、フォールバックとして既存の iOS リワードユニットIDを使用する。

## 4. 課金ユーザー配慮
*   `PurchaseController.isPremium == true` の場合、バナー・リワードともにロードおよび表示をスキップする。
