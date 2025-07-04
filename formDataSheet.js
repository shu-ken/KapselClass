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
  clearShopList(shopCodes) {
    const paddedFormData = [[], ...this.ssData];

    shopCodes.forEach((shopCode) => {
      const rowIndexes = this.findRowsByShopCode(paddedFormData, shopCode);
      rowIndexes.forEach((rowIdx) => this.clearRowRange(rowIdx));
    });

    SpreadsheetApp.flush();
  }

  /**
   * 指定された店舗コードに一致する行番号を返す
   * @param {Array[]} data シートデータ（padded）
   * @param {string} shopCode 店舗コード
   * @returns {number[]} 一致する行インデックス（1始まり）
   */
  findRowsByShopCode(data, shopCode) {
    const result = [];
    data.forEach((row, i) => {
      if (row[this.colMap.shopCode.index] === shopCode) result.push(i);
    });
    return result;
  }

  /**
   * 指定行の delStartCol 〜 delEndCol をクリアする
   * @param {number} rowIdx クリア対象の行インデックス
   */
  clearRowRange(rowIdx) {
    const startCol = this.colMap.delStartCol.alphabet;
    const endCol = this.colMap.delEndCol.alphabet;
    this.sheet.getRange(`${startCol}${rowIdx}:${endCol}${rowIdx}`).clearContent();
  }
}
