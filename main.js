function main() {
  const spreadSheet = new PlanManagementSheet();

  spreadSheet.shopListMaker();

  spreadSheet.duplicateChecker();

  spreadSheet.noticeDuplicate();

  const formSheet = new FormDataSheet();

  formSheet.clearShopList(spreadSheet.getUniqueList());
}
