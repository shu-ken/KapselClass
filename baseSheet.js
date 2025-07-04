class BaseSheet {
  constructor(sheetId, sheetName, cols) {
    if (!sheetId || !sheetName || !cols) {
      throw new Error("必要な引数（sheetId, sheetName, cols）が不足しています");
    }

    this.sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!this.sheet) {
      throw new Error(`指定されたシート「${sheetName}」が見つかりません`);
    }

    this.ssData = this.sheet.getDataRange().getValues();
    this.cols = cols;
    this.colMap = this.createColMap();
  }

  /**
   * 任意のオフセット行からヘッダーを取得
   * @param {number} offset ヘッダー行のインデックス（0が最初の行）
   */
  getHeaderRow(offset = 0) {
    return this.ssData[offset];
  }

  createColMap() {
    const headers = this.getHeaderRow();
    const colMap = {};
    for (const [key, val] of Object.entries(this.cols)) {
      const idx = headers.indexOf(val);
      colMap[key] = {
        alphabet: this.indexToAlphabet(idx),
        index: idx,
      };
    }
    return colMap;
  }

  indexToAlphabet(index) {
    let alphabetCol = "";
    while (index >= 0) {
      let remainder = index % 26;
      alphabetCol = String.fromCharCode(remainder + "A".charCodeAt(0)) + alphabetCol;
      index = Math.floor(index / 26) - 1;
    }
    return alphabetCol;
  }
}
