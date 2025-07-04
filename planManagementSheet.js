class PlanManagementSheet extends BaseSheet {
  constructor() {
    const SCRIPT_ID_DEV = "1yY0gkabc4Huc76mXMi1jxlFJsEnC8pcHK0LbUQV7vlGuEyo5eL2dxJ44";
    const SCRIPT_ID_PROD = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // ← 本番スクリプトID

    const SHEET_ID_DEV = "1Aun4JtdUgG6goG9gM1c9gcgPq3IOAzyShJDUqGWb3l0";
    const SHEET_ID_PROD = "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"; // ← 本番シートID

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
    super(sheetId, sheetName, cols);
  }

  /**
   * 4行目をヘッダー行として取得（offset = 3）
   */
  getHeaderRow() {
    return super.getHeaderRow(3);
  }

  /**
   * 解約日が直近2ヶ月前の店舗だけを抽出し this.allShopList に格納
   */
  shopListMaker() {
    const [, , , headers, ...rows] = this.ssData;
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1); //2ヶ月前の月初
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1); //2ヶ月前の月末
    this.allShopList = rows.filter((row) => {
      const hasShopCode = row[this.colMap.shopCode.index];
      const canceledDate = new Date(row[this.colMap.planChangeDate.index]);
      const isCancelDateRange = canceledDate >= startDate && canceledDate <= endDate;
      return hasShopCode && isCancelDateRange;
    });
    console.log(this.allShopList.length);
  }

  /**
   * 店舗コードの重複を検出し、ユニーク・重複リストを作成
   */
  duplicateChecker() {
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
    this.uniqueList = Array.from(uniqueSet);
    this.duplicateList = Array.from(duplicateSet);
    console.log("ユニーク店番：", this.uniqueList);
  }

  /**
   * 重複が存在する場合に警告を表示
   */
  noticeDuplicate() {
    if (this.duplicateList && this.duplicateList.length !== 0) {
      console.log("エラー：重複が見つかりました");
      console.log("重複店番：", this.duplicateList);
    }
  }

  getUniqueList() {
    return this.uniqueList;
  }
}
