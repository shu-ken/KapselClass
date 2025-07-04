class BaseSheet {
  constructor(sheetId, sheetName, cols) {
    if (!sheetId || !sheetName || !cols) throw new Error("必要な引数（sheetId, sheetName, cols）が不足しています");

    this.sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!this.sheet) throw new Error(`指定されたシート「${sheetName}」が見つかりません`);

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

  /**
   * colsのマッピングに基づき、列のインデックスとアルファベットを取得
   */
  createColMap() {
    const headers = this.getHeaderRow();
    const colMap = {};

    for (const [key, label] of Object.entries(this.cols)) {
      const idx = headers.indexOf(label);
      if (idx === -1) throw new Error(`カラム名「${label}」がヘッダーに存在しません（キー: ${key}）`);

      colMap[key] = {
        index: idx,
        alphabet: BaseSheet.indexToAlphabet(idx),
        label: label,
      };
    }

    return colMap;
  }

  /**
   * 数値インデックス → A1表記の列記号に変換
   * 例: 0 → A, 1 → B, ..., 26 → AA
   * @param {number} index
   */
  static indexToAlphabet(index) {
    if (typeof index !== "number" || index < 0) throw new Error(`不正な列インデックス: ${index}`);

    let alphabetCol = "";
    while (index >= 0) {
      const remainder = index % 26;
      alphabetCol = String.fromCharCode(65 + remainder) + alphabetCol;
      index = Math.floor(index / 26) - 1;
    }
    return alphabetCol;
  }

  /**
   * スクリプトIDに応じてシートIDを返す共通メソッド
   * @param {Object} mapping - Script ID と Sheet ID のマッピング
   */
  static getSheetIdByEnv(mapping) {
    const scriptId = ScriptApp.getScriptId();
    if (!mapping[scriptId]) throw new Error(`未定義のScript ID: ${scriptId}`);
    return mapping[scriptId];
  }
}
