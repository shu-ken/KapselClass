class FormDataSheet extends BaseSheet {
  constructor() {
    const SCRIPT_ID_DEV = "1yY0gkabc4Huc76mXMi1jxlFJsEnC8pcHK0LbUQV7vlGuEyo5eL2dxJ44";
    const SCRIPT_ID_PROD = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // ← 実際の本番Script IDを記入

    const SHEET_ID_DEV = "1g39PgTEbF8mZdW5b5dz-g4PfizVbLmbNtQ_bPW-uZew";
    const SHEET_ID_PROD = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"; // ← 実際の本番Sheet IDを記入

    const sheetId = BaseSheet.getSheetIdByEnv({
      [SCRIPT_ID_DEV]: SHEET_ID_DEV,
      [SCRIPT_ID_PROD]: SHEET_ID_PROD,
    });

    const sheetName = "まとめ";
    const cols = {
      shopCode: "店舗番号",
      delStartCol: "削除最初",
      delEndCol: "削除終わり",
    };
    super(sheetId, sheetName, cols);
  }

  /**
   * 指定された店舗コード（shopCode）の行に対応するセル範囲を空にする
   * @param {string[]} uniqueList
   */
  clearShopList(uniqueList) {
    const paddedFormData = [[], ...this.ssData];

    uniqueList.forEach((shopCode) => {
      paddedFormData.forEach((row, i) => {
        if (row[this.colMap.shopCode.index] !== shopCode) return;
        const startCell = this.colMap.delStartCol.alphabet + i;
        const endCell = this.colMap.delEndCol.alphabet + i;
        this.sheet.getRange(`${startCell}:${endCell}`).clearContent();
      });
    });
    SpreadsheetApp.flush(); // まとめて反映
  }
}
