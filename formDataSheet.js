class FormDataSheet extends BaseSheet {
  constructor() {
    const SCRIPT_ID_DEV = "1yY0gkabc4Huc76mXMi1jxlFJsEnC8pcHK0LbUQV7vlGuEyo5eL2dxJ44";
    const SCRIPT_ID_PROD = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

    const SHEET_ID_DEV = "1g39PgTEbF8mZdW5b5dz-g4PfizVbLmbNtQ_bPW-uZew";
    const SHEET_ID_PROD = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy";

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
   * uniqueListの店番を持つまとめシートの行に対し、全媒体のIDPWを削除する
   * @param {string[]} uniqueList
   */
  clearShopIDPW(uniqueList, logSheetId) {
    try {
      const paddedFormData = [[], ...this.ssData];
      uniqueList.forEach((shopCode) => {
        const result = this.findRowsByShopCode(paddedFormData, shopCode);
        // ログは「planManagementSheet側IDPW削除ログ」シートに書き込む
        const idpwLogSheet = new IdpwLogSheet(logSheetId);
        idpwLogSheet.writeUniqueList([shopCode]);
        result.result.forEach((rowIdx) => this.clearRowRange(rowIdx));
      });
      SpreadsheetApp.flush();
    } catch (e) {
      console.error("clearShopIDPWでエラーが発生しました:", e.message);
    }
  }

  /**
   *
   * @param {string[]} uniqueList
   */
  writeUniqueList(uniqueList) {
    if (!uniqueList || uniqueList.length === 0) return;

    const startRow = 2;
    const colAlphabet = this.colMap.deletedShops.alphabet;
    const range = this.sheet.getRange(`${colAlphabet}${startRow}:${colAlphabet}${startRow + uniqueList.length - 1}`);
    const values = uniqueList.map((v) => [v]);
    range.setValues(values);
  }

  /**
   * 指定された店舗コードに一致する行番号を返す
   * @param {Array[]} data シートデータ（padded）
   * @param {string} shopCode 店舗コード
   * @returns {number[]} 一致する行インデックス（1始まり）
   */
  findRowsByShopCode(data, shopCode) {
    const result = [];
    const result2 = [];
    data.forEach((row, i) => {
      if (row[this.colMap.shopCode.index] === shopCode) {
        result.push(i);
        result2.push(shopCode);
      }
    });
    return { result, result2 };
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
