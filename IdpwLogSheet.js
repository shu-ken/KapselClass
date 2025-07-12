class IdpwLogSheet extends BaseSheet {
  constructor(sheetId) {
    const sheetName = "IDPW削除ログ";
    const cols = {
      executionDate: "実行日",
      deletedShops: "削除済店舗",
      duplicateShops: "重複未削除",
    };
    const headerRow = 0; // 1行目がヘッダーなら0
    super(sheetId, sheetName, cols, headerRow);
  }

  /**
   *
   * @param {string[]} uniqueList
   */
  writeUniqueList(uniqueList) {
    if (!uniqueList || uniqueList.length === 0) return;

    const colAlphabet = this.colMap.deletedShops.alphabet;
    const sheet = this.sheet;

    // 「削除済店舗」列のヘッダー直下〜最終行までを取得
    const lastRow = sheet.getLastRow();
    const existing = sheet.getRange(`${colAlphabet}${this.headerRow + 1}:${colAlphabet}${lastRow}`).getValues();

    // 空でない行数（=すでに入力済の店舗数）
    let offset = 0;
    for (let i = 0; i < existing.length; i++) {
      if (existing[i][0] && String(existing[i][0]).trim() !== "") offset++;
      else break;
    }
    const writeStartRow = this.headerRow + 1 + offset;
    const writeEndRow = writeStartRow + uniqueList.length - 1;
    const range = sheet.getRange(`${colAlphabet}${writeStartRow}:${colAlphabet}${writeEndRow}`);
    const values = uniqueList.map((v) => [v]);
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
    range.setValues(values);
  }
}
