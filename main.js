// 再プッシュ
function main() {
  try {
    const planSheet = new PlanManagementSheet();

    planSheet.shopListMaker();
    planSheet.duplicateChecker();
    planSheet.noticeDuplicate();

    const formSheet = new FormDataSheet();

    formSheet.clearShopList(planSheet.getUniqueList());
  } catch (e) {
    Logger.log("エラーが発生しました: %s", e.message);
    throw e;
  }
}
