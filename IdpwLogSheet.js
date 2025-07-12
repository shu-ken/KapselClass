class IdpwLogSheet extends BaseSheet {
  constructor(sheetId) {
    const sheetName = "IDPW削除ログ";
    const cols = {
      executionDate: "実行日",
      deletedShops: "削除済店舗",
      duplicateShops: "重複未削除",
    };
    console.log(sheetId);
    super(sheetId, sheetName, cols);
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
    console.log("range");
    console.log(range);
    range.setValues(values);
  }

  /**
   * 重複リスト（配列）をC列に書き込む
   * @param {string[]} duplicateList
   */
  writeDuplicateList(duplicateList) {
    if (!duplicateList || duplicateList.length === 0) return;

    const startRow = 2;
    const colAlphabet = this.colMap.duplicateShops.alphabet;
    const range = this.sheet.getRange(`${colAlphabet}${startRow}:${colAlphabet}${startRow + duplicateList.length - 1}`);
    const values = duplicateList.map((v) => [v]);
    console.log("range");
    console.log(range);
    range.setValues(values);
  }
}
