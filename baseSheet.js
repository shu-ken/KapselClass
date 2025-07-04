class BaseSheet {
  constructor(sheetId, sheetName, cols) {
    this.sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    this.ssData = this.sheet.getDataRange().getValues();
    this.cols = cols;
    this.colMap = this.createColMap();
  }

  getHeaderRow(offset = 0) {
    const headers = this.ssData[offset];
    return headers;
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
