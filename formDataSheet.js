class FormDataSheet extends BaseSheet {
  constructor() {
    const sheetId = formDataSheet.switchDevEnv();
    const sheetName = "まとめ";
    const cols = {
      shopCode: "店舗番号",
      delStartCol: "削除最初",
      delEndCol: "削除終わり",
    };
    super(sheetId, sheetName, cols);
  }

  static switchDevEnv() {
    let sheetId;
    switch (ScriptApp.getScriptId()) {
      // 開発環境
      case "1yY0gkabc4Huc76mXMi1jxlFJsEnC8pcHK0LbUQV7vlGuEyo5eL2dxJ44":
        sheetId = "1g39PgTEbF8mZdW5b5dz-g4PfizVbLmbNtQ_bPW-uZew";
        break;
      // 本番
      case "xxx":
        sheetId = "yyy";
        break;
      default:
        throw "本番と開発以外に使用されているScriptIDです";
    }
    return sheetId;
  }

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
