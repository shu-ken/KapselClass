class PlanManagementSheet extends BaseSheet {
  constructor() {
    const SCRIPT_ID_DEV = "1yY0gkabc4Huc76mXMi1jxlFJsEnC8pcHK0LbUQV7vlGuEyo5eL2dxJ44";
    const SCRIPT_ID_PROD = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const SHEET_ID_DEV = "1Aun4JtdUgG6goG9gM1c9gcgPq3IOAzyShJDUqGWb3l0";
    const SHEET_ID_PROD = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy";

    const sheetId = BaseSheet.getSheetIdByEnv({
      [SCRIPT_ID_DEV]: SHEET_ID_DEV,
      [SCRIPT_ID_PROD]: SHEET_ID_PROD,
    });

    const sheetName = "メディア更新代行年間プラン";
    const cols = {
      status: "ステータス",
      shopName: "店名",
      shopCode: "店番",
      planChangeDate: "解約日",
    };
    const headerRow = 3;
    super(sheetId, sheetName, cols, headerRow);
  }

  /**
   * 空白行（店番未入力行）を削除し、当月から見た先々月の月初〜月末を解約日に含む店舗情報リストを作成し、メンバーとして保持
   * @returns {Array} - フィルタして2次元配列を返す
   */
  shopListMaker() {
    try {
      const [, , , , ...rows] = this.ssData;
      const currentDate = new Date();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0); // 2ヶ月前の月末
      this.allShopList = rows.filter((row) => {
        const canceledDate = new Date(row[this.colMap.planChangeDate.index]);
        const shopCodeStr = String(row[this.colMap.shopCode.index] || "");

        // 条件をまとめて評価
        const isValidShop = shopCodeStr && !shopCodeStr.endsWith("-0") && !shopCodeStr.endsWith("-");
        const isCancelDateRange = canceledDate <= endOfMonth; // 解約日が2ヶ月前の月末より前

        return isValidShop && isCancelDateRange;
      });
      console.log(this.allShopList.length);
    } catch (e) {
      console.error("shopListMakerでエラーが発生しました:", e.message);
    }
  }

  /**
   * 二次元配列に重複店番があるかを確認し、重複あり・なしの店番リストをメンバーとして保持し返す
   * @returns {Object} - オブジェクトでまとめた重複あり・なしの店番リスト
   * @property {Array} duplicateList
   * @property {Array} uniqueList
   */
  duplicateChecker() {
    try {
      const valueCounts = {};
      const uniqueSet = new Set();
      const duplicateSet = new Set();
      (this.allShopList || []).forEach((row) => {
        const shopCode = row[this.colMap.shopCode.index];
        valueCounts[shopCode] = (valueCounts[shopCode] || 0) + 1;
        if (valueCounts[shopCode] === 1) {
          uniqueSet.add(shopCode);
        } else {
          uniqueSet.delete(shopCode);
          duplicateSet.add(shopCode);
        }
      });
      this.duplicateList = Array.from(duplicateSet);
      this.uniqueList = Array.from(uniqueSet);
      console.log("ユニーク店番:", this.uniqueList);
      // const idpwLogSheet = new IdpwLogSheet(this.sheet.getParent().getId());
      // idpwLogSheet.writeUniqueList(this.uniqueList);
    } catch (e) {
      console.error("duplicateCheckerでエラーが発生しました:", e.message);
    }
  }

  /**
   * 重複店番があれば通知する
   */
  noticeDuplicate() {
    if (this.duplicateList && this.duplicateList.length !== 0) {
      console.log("エラー: 重複が見つかりました。");
      console.log("重複店番:", this.duplicateList);
      // ログ等を出して「メディア更新代行年間プラン」の修正を促す
      const idpwLogSheet = new IdpwLogSheet(this.sheet.getParent().getId());
      idpwLogSheet.writeDuplicateList(this.duplicateList);
    }
  }

  /**
   * ユニークな店番のリストを取得する
   * @returns {Array} - ユニークな店番の配列
   */
  getUniqueList() {
    return this.uniqueList;
  }
}
