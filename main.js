function main() {
  const spreadSheet = new planManagementSheet();

  spreadSheet.shopListMaker();

  spreadSheet.duplicateChecker();

  spreadSheet.noticeDuplicate();

  const formSheet = new formDataSheet();

  formSheet.clearShopList(spreadSheet.getUniqueList());
}
