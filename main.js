function main() {
  try {
    // planManagementSheetクラスをインスタンス化（ssData, cols, colMap, allShopListは内部で初期化される）
    const planSheet = new PlanManagementSheet();

    // 空白行（店番未入力行）を削除し、当月から見た先々月の月初〜月末を解約日に含む店舗情報リストを作成し、メンバーとして保持
    planSheet.shopListMaker();

    // 店番の重複なし・ありを配列でまとめる
    planSheet.duplicateChecker();

    // 重複チェック
    planSheet.noticeDuplicate();

    // formDataSheetクラスのインスタンスを作成
    const formSheet = new FormDataSheet();

    // 解約店舗の全媒体のIDPWを削除
    formSheet.clearShopIDPW(planSheet.getUniqueList());
  } catch (e) {
    console.log("エラーが発生しました:", e.message);
  }
}
