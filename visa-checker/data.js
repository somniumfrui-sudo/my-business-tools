/**
 * data.js — データ層
 * ロジック・UIから完全に分離。後からJSONファイルや APIに差し替え可能。
 * 使い方: <script src="data.js"></script> でグローバル VISA_DATA を注入
 */

const VISA_DATA = {

  // ── 1. 在留資格マスタ ──────────────────────────────────────────
  visas: [
    { id: "tokutei1",  label: "特定技能1号",       slug: "tokutei1",  color: "#1d4ed8" },
    { id: "tokutei2",  label: "特定技能2号",       slug: "tokutei2",  color: "#0f766e" },
    { id: "gijinkoku", label: "技術・人文・国際業務", slug: "gijinkoku", color: "#7c3aed" },
    { id: "kinou",     label: "高度専門職",         slug: "kinou",     color: "#b45309" },
    { id: "kigyo",     label: "経営・管理",         slug: "kigyo",     color: "#be185d" },
    { id: "kenshu",    label: "技能実習",           slug: "kenshu",    color: "#0369a1" },
    { id: "haken",     label: "特定活動（46号）",   slug: "haken",     color: "#166534" },
  ],

  // ── 2. 手続きマスタ ──────────────────────────────────────────
  procedures: [
    { id: "new",      label: "新規申請（上陸許可）", days: 30 },
    { id: "renew",    label: "在留期間更新",         days: 14 },
    { id: "change",   label: "在留資格変更",         days: 21 },
    { id: "activity", label: "就労資格証明書",       days: 10 },
  ],

  // ── 3. 雇用形態マスタ ──────────────────────────────────────────
  empTypes: [
    { id: "direct",   label: "直接雇用" },
    { id: "dispatch", label: "派遣・出向" },
    { id: "transfer", label: "企業内転勤" },
  ],

  // ── 4. 都道府県マスタ ──────────────────────────────────────────
  prefectures: [
    { id: "tokyo",    label: "東京都",   office: "東京出入国在留管理局" },
    { id: "osaka",    label: "大阪府",   office: "大阪出入国在留管理局" },
    { id: "kanagawa", label: "神奈川県", office: "横浜支局" },
    { id: "aichi",    label: "愛知県",   office: "名古屋出入国在留管理局" },
    { id: "fukuoka",  label: "福岡県",   office: "福岡出入国在留管理局" },
    { id: "sapporo",  label: "北海道",   office: "札幌出入国在留管理局" },
    { id: "sendai",   label: "宮城県",   office: "仙台出入国在留管理局" },
    { id: "hiroshima",label: "広島県",   office: "広島出入国在留管理局" },
    { id: "other",    label: "その他",   office: "最寄りの出入国在留管理局" },
  ],

  // ── 5. 必要書類マスタ（visa × procedure × empType の3次元）──
  //   isRequired: true = 必須 / false = 条件付き
  //   condition: 条件付きの場合の説明
  documents: {

    // ========== 特定技能1号 ==========
    tokutei1: {
      new: {
        direct: [
          { name: "在留資格認定証明書（COE）交付申請書", isRequired: true,  note: "入管様式第6号" },
          { name: "パスポートのコピー（全ページ）",       isRequired: true,  note: "有効期限3ヶ月以上" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "6ヶ月以内撮影・白背景" },
          { name: "特定技能雇用契約書（写）",             isRequired: true,  note: "報酬額・労働条件を明記" },
          { name: "雇用条件書（写）",                     isRequired: true,  note: "日本語＋母国語で作成" },
          { name: "技能測定試験合格証明書",               isRequired: true,  note: "特定産業分野の試験" },
          { name: "日本語能力試験 合格証書",              isRequired: true,  note: "N4以上 または 国際交流基金テストA2以上" },
          { name: "健康診断個人票",                       isRequired: true,  note: "指定様式による" },
          { name: "事前ガイダンス確認書",                 isRequired: true,  note: "登録支援機関または所属機関が作成" },
          { name: "登録支援機関との支援委託契約書（写）", isRequired: false, note: "登録支援機関に委託する場合", condition: "登録支援機関に支援を委託する場合のみ" },
          { name: "納税義務の履行を証明する文書",         isRequired: true,  note: "住民税課税証明書・納税証明書" },
          { name: "特定技能所属機関の決算書（写）",       isRequired: true,  note: "直近1年分" },
        ],
        dispatch: [
          { name: "派遣元・派遣先間の雇用関係書類",       isRequired: true,  note: "派遣契約書の写し" },
          { name: "派遣先の登記事項証明書",               isRequired: true,  note: "3ヶ月以内取得" },
          { name: "在留資格認定証明書（COE）交付申請書", isRequired: true,  note: "入管様式第6号" },
          { name: "技能測定試験合格証明書",               isRequired: true,  note: "" },
          { name: "特定技能雇用契約書（写）",             isRequired: true,  note: "" },
          { name: "パスポートのコピー",                   isRequired: true,  note: "" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "" },
          { name: "健康診断個人票",                       isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "企業内転勤に関する説明書",             isRequired: true,  note: "転勤前後の職務内容の一致を説明" },
          { name: "派遣・直接雇用と共通の必須書類",       isRequired: false, note: "上記に準じる" },
        ],
      },
      renew: {
        direct: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "入管様式第3号" },
          { name: "パスポートおよび在留カード",           isRequired: true,  note: "原本提示・コピー提出" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "" },
          { name: "特定技能雇用契約書（最新版写）",       isRequired: true,  note: "" },
          { name: "支援計画履行状況届出書（写）",         isRequired: true,  note: "直近の定期届出のもの" },
          { name: "住民税の課税証明書・納税証明書",       isRequired: true,  note: "直近1年分" },
          { name: "国税の納付状況を証する文書",           isRequired: true,  note: "法人税の納付証明（法人の場合）" },
          { name: "登録支援機関との委託契約継続書類",     isRequired: false, note: "", condition: "委託を継続する場合のみ" },
        ],
        dispatch: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "パスポートおよび在留カード",           isRequired: true,  note: "" },
          { name: "派遣契約更新書類（写）",               isRequired: true,  note: "" },
          { name: "住民税の課税証明書・納税証明書",       isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "パスポートおよび在留カード",           isRequired: true,  note: "" },
          { name: "転勤継続を示す辞令（写）",             isRequired: true,  note: "" },
        ],
      },
      change: {
        direct: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "入管様式第22号" },
          { name: "現在の在留カード（コピー）",           isRequired: true,  note: "" },
          { name: "パスポートのコピー",                   isRequired: true,  note: "" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "" },
          { name: "技能測定試験合格証明書",               isRequired: true,  note: "変更後の資格に対応したもの" },
          { name: "特定技能雇用契約書（写）",             isRequired: true,  note: "新しい契約書" },
          { name: "変更前の活動を証明する書類",           isRequired: true,  note: "直近の源泉徴収票等" },
        ],
        dispatch: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "現在の在留カード（コピー）",           isRequired: true,  note: "" },
          { name: "派遣契約書（写）",                     isRequired: true,  note: "" },
          { name: "技能測定試験合格証明書",               isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "企業内転勤に関する説明書",             isRequired: true,  note: "" },
        ],
      },
      activity: {
        direct: [
          { name: "就労資格証明書交付申請書",             isRequired: true,  note: "入管様式第20号" },
          { name: "パスポートおよび在留カード",           isRequired: true,  note: "" },
          { name: "現在の雇用契約書（写）",               isRequired: true,  note: "" },
          { name: "特定技能雇用契約書（写）",             isRequired: true,  note: "取得しておくと転職が容易になる" },
        ],
        dispatch: [
          { name: "就労資格証明書交付申請書",             isRequired: true,  note: "" },
          { name: "派遣先変更に係る確認書類",             isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "就労資格証明書交付申請書",             isRequired: true,  note: "" },
          { name: "転勤命令書（写）",                     isRequired: true,  note: "" },
        ],
      },
    },

    // ========== 技術・人文・国際業務 ==========
    gijinkoku: {
      new: {
        direct: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "入管様式第6号" },
          { name: "パスポートのコピー（全ページ）",       isRequired: true,  note: "" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "" },
          { name: "大学・専門学校の卒業証明書",           isRequired: true,  note: "学歴要件を満たすもの" },
          { name: "成績証明書",                           isRequired: true,  note: "専攻と職務の関連性を示す" },
          { name: "採用理由書",                           isRequired: true,  note: "日本語で職務内容と専攻の関連を詳述" },
          { name: "雇用契約書（写）",                     isRequired: true,  note: "労働条件・報酬額を明記" },
          { name: "登記事項証明書（法人）",               isRequired: true,  note: "3ヶ月以内取得" },
          { name: "会社の決算書（写）",                   isRequired: true,  note: "直近1〜2期分" },
          { name: "会社のパンフレット・事業内容説明書",   isRequired: true,  note: "" },
          { name: "上場企業であることを証する書類",       isRequired: false, note: "", condition: "カテゴリー1企業の場合のみ（他書類を省略可能）" },
          { name: "前年分の職員の給与所得の源泉徴収票等の法定調書合計表（写）", isRequired: false, note: "", condition: "カテゴリー2の場合" },
        ],
        dispatch: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "" },
          { name: "パスポートのコピー",                   isRequired: true,  note: "" },
          { name: "採用理由書",                           isRequired: true,  note: "" },
          { name: "雇用契約書（写）",                     isRequired: true,  note: "" },
          { name: "派遣契約書（写）",                     isRequired: true,  note: "派遣先の情報を含む" },
          { name: "派遣先の事業内容証明書類",             isRequired: true,  note: "" },
          { name: "卒業証明書",                           isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "" },
          { name: "転勤命令書（写）",                     isRequired: true,  note: "" },
          { name: "海外拠点での在職証明書",               isRequired: true,  note: "1年以上在職していた証明" },
          { name: "採用理由書",                           isRequired: true,  note: "" },
          { name: "登記事項証明書",                       isRequired: true,  note: "" },
        ],
      },
      renew: {
        direct: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "パスポートおよび在留カード",           isRequired: true,  note: "原本" },
          { name: "住民税の課税証明書・納税証明書",       isRequired: true,  note: "直近1年" },
          { name: "在職証明書または雇用継続を示す書類",   isRequired: true,  note: "" },
          { name: "直近の給与明細（写）",                 isRequired: true,  note: "3ヶ月分" },
          { name: "源泉徴収票（写）",                     isRequired: true,  note: "直近1年分" },
          { name: "法人の決算書（写）",                   isRequired: false, note: "", condition: "カテゴリー3・4企業の場合" },
        ],
        dispatch: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "パスポートおよび在留カード",           isRequired: true,  note: "" },
          { name: "派遣継続を示す契約書（写）",           isRequired: true,  note: "" },
          { name: "住民税の課税証明書",                   isRequired: true,  note: "" },
          { name: "直近の給与明細",                       isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "転勤継続を示す辞令（写）",             isRequired: true,  note: "" },
          { name: "住民税の課税証明書",                   isRequired: true,  note: "" },
        ],
      },
      change: {
        direct: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "在留カードのコピー",                   isRequired: true,  note: "" },
          { name: "採用理由書",                           isRequired: true,  note: "変更後の職務内容と専攻の関連" },
          { name: "雇用契約書（写）",                     isRequired: true,  note: "" },
          { name: "学歴・職歴を証する書類",               isRequired: true,  note: "" },
          { name: "変更前の在留資格の活動内容を証明する書類", isRequired: true, note: "" },
        ],
        dispatch: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "在留カードのコピー",                   isRequired: true,  note: "" },
          { name: "採用理由書",                           isRequired: true,  note: "" },
          { name: "派遣契約書（写）",                     isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "転勤命令書（写）",                     isRequired: true,  note: "" },
          { name: "在留カードのコピー",                   isRequired: true,  note: "" },
        ],
      },
      activity: {
        direct: [
          { name: "就労資格証明書交付申請書",             isRequired: true,  note: "転職時に取得しておくと便利" },
          { name: "新しい雇用契約書（写）",               isRequired: true,  note: "" },
          { name: "採用理由書（新雇用主作成）",           isRequired: true,  note: "" },
          { name: "在留カード（コピー）",                 isRequired: true,  note: "" },
        ],
        dispatch: [
          { name: "就労資格証明書交付申請書",             isRequired: true,  note: "" },
          { name: "新しい派遣先情報",                     isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "就労資格証明書交付申請書",             isRequired: true,  note: "" },
          { name: "転勤命令書（写）",                     isRequired: true,  note: "" },
        ],
      },
    },

    // ========== 高度専門職 ==========
    kinou: {
      new: {
        direct: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "" },
          { name: "高度人材ポイント計算表",               isRequired: true,  note: "法務省の計算シートを使用" },
          { name: "学歴・職歴・年収を証明する書類",       isRequired: true,  note: "ポイント項目ごとに用意" },
          { name: "雇用契約書（写）",                     isRequired: true,  note: "年収を明示" },
          { name: "登記事項証明書",                       isRequired: true,  note: "" },
          { name: "イノベーション促進支援措置の証明",     isRequired: false, note: "", condition: "ボーナスポイント対象機関の場合" },
        ],
        dispatch: [
          { name: "高度人材ポイント計算表",               isRequired: true,  note: "" },
          { name: "派遣契約書（写）",                     isRequired: true,  note: "" },
          { name: "学歴・職歴・年収証明書類",             isRequired: true,  note: "" },
        ],
        transfer: [
          { name: "高度人材ポイント計算表",               isRequired: true,  note: "" },
          { name: "転勤命令書",                           isRequired: true,  note: "" },
        ],
      },
      renew: {
        direct: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "高度人材ポイント計算表（最新）",       isRequired: true,  note: "" },
          { name: "年収証明書類",                         isRequired: true,  note: "直近の源泉徴収票" },
          { name: "在留カード・パスポート",               isRequired: true,  note: "" },
        ],
        dispatch: [{ name: "在留期間更新許可申請書",     isRequired: true, note: "" }],
        transfer: [{ name: "在留期間更新許可申請書",     isRequired: true, note: "" }],
      },
      change: {
        direct: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "高度人材ポイント計算表",               isRequired: true,  note: "" },
          { name: "雇用契約書（写）",                     isRequired: true,  note: "" },
        ],
        dispatch: [{ name: "在留資格変更許可申請書",     isRequired: true, note: "" }],
        transfer: [{ name: "在留資格変更許可申請書",     isRequired: true, note: "" }],
      },
      activity: {
        direct: [{ name: "就労資格証明書交付申請書",     isRequired: true, note: "" }],
        dispatch: [{ name: "就労資格証明書交付申請書",   isRequired: true, note: "" }],
        transfer: [{ name: "就労資格証明書交付申請書",   isRequired: true, note: "" }],
      },
    },

    // ========== 経営・管理 ==========
    kigyo: {
      new: {
        direct: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "" },
          { name: "事業計画書",                           isRequired: true,  note: "事業内容・収支計画を詳述" },
          { name: "登記事項証明書（設立済みの場合）",     isRequired: false, note: "", condition: "法人設立後の場合" },
          { name: "事務所の使用権を証する書類",           isRequired: true,  note: "賃貸借契約書など" },
          { name: "出資者・役員情報",                     isRequired: true,  note: "" },
          { name: "資本金の払込証明",                     isRequired: true,  note: "500万円以上 または 常勤職員2名以上" },
          { name: "パスポートのコピー",                   isRequired: true,  note: "" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "" },
        ],
        dispatch: [{ name: "在留資格認定証明書交付申請書", isRequired: true, note: "" }],
        transfer: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "" },
          { name: "海外法人との関係を示す書類",           isRequired: true,  note: "" },
        ],
      },
      renew: {
        direct: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "法人の決算書（直近2期分）",            isRequired: true,  note: "" },
          { name: "役員報酬の記載がある議事録",           isRequired: true,  note: "" },
          { name: "登記事項証明書",                       isRequired: true,  note: "3ヶ月以内" },
          { name: "事業所の使用権を示す書類",             isRequired: true,  note: "" },
        ],
        dispatch: [{ name: "在留期間更新許可申請書",     isRequired: true, note: "" }],
        transfer: [{ name: "在留期間更新許可申請書",     isRequired: true, note: "" }],
      },
      change: {
        direct: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "事業計画書",                           isRequired: true,  note: "" },
          { name: "登記事項証明書",                       isRequired: true,  note: "" },
        ],
        dispatch: [{ name: "在留資格変更許可申請書",     isRequired: true, note: "" }],
        transfer: [{ name: "在留資格変更許可申請書",     isRequired: true, note: "" }],
      },
      activity: {
        direct: [{ name: "就労資格証明書交付申請書",     isRequired: true, note: "" }],
        dispatch: [{ name: "就労資格証明書交付申請書",   isRequired: true, note: "" }],
        transfer: [{ name: "就労資格証明書交付申請書",   isRequired: true, note: "" }],
      },
    },

    // ========== 技能実習 ==========
    kenshu: {
      new: {
        direct: [
          { name: "在留資格認定証明書交付申請書",         isRequired: true,  note: "" },
          { name: "技能実習計画認定通知書（写）",         isRequired: true,  note: "外国人技能実習機構（OTIT）発行" },
          { name: "技能実習計画書（写）",                 isRequired: true,  note: "" },
          { name: "監理団体許可書（写）",                 isRequired: false, note: "", condition: "団体監理型の場合" },
          { name: "雇用契約書または技能実習協定（写）",   isRequired: true,  note: "" },
          { name: "パスポートのコピー",                   isRequired: true,  note: "" },
          { name: "写真（4cm×3cm）",                    isRequired: true,  note: "" },
        ],
        dispatch: [
          { name: "監理団体許可書（写）",                 isRequired: true,  note: "" },
          { name: "技能実習計画認定通知書（写）",         isRequired: true,  note: "" },
        ],
        transfer: [{ name: "在留資格認定証明書交付申請書", isRequired: true, note: "" }],
      },
      renew: {
        direct: [
          { name: "在留期間更新許可申請書",               isRequired: true,  note: "" },
          { name: "技能実習計画認定通知書（最新）",       isRequired: true,  note: "2号・3号への移行分" },
          { name: "技能検定3級等の合格証書",             isRequired: false, note: "", condition: "2号→3号移行の場合" },
        ],
        dispatch: [{ name: "在留期間更新許可申請書",     isRequired: true, note: "" }],
        transfer: [{ name: "在留期間更新許可申請書",     isRequired: true, note: "" }],
      },
      change: {
        direct: [
          { name: "在留資格変更許可申請書",               isRequired: true,  note: "" },
          { name: "変更後の技能実習計画認定通知書",       isRequired: true,  note: "" },
        ],
        dispatch: [{ name: "在留資格変更許可申請書",     isRequired: true, note: "" }],
        transfer: [{ name: "在留資格変更許可申請書",     isRequired: true, note: "" }],
      },
      activity: {
        direct: [{ name: "就労資格証明書交付申請書",     isRequired: true, note: "" }],
        dispatch: [{ name: "就労資格証明書交付申請書",   isRequired: true, note: "" }],
        transfer: [{ name: "就労資格証明書交付申請書",   isRequired: true, note: "" }],
      },
    },

    // ========== 特定技能2号・特定活動46号（簡略版） ==========
    tokutei2: {
      new:    { direct: [{ name: "特定技能2号用COE申請書", isRequired: true, note: "特定技能1号からの移行が原則" }], dispatch: [], transfer: [] },
      renew:  { direct: [{ name: "在留期間更新許可申請書",  isRequired: true, note: "" }], dispatch: [], transfer: [] },
      change: { direct: [{ name: "在留資格変更許可申請書",  isRequired: true, note: "" }], dispatch: [], transfer: [] },
      activity:{ direct:[{ name: "就労資格証明書交付申請書",isRequired: true, note: "" }], dispatch: [], transfer: [] },
    },
    haken: {
      new:    { direct: [{ name: "在留資格認定証明書交付申請書", isRequired: true, note: "特定活動46号は大卒以上が対象" }, { name: "大学卒業証明書", isRequired: true, note: "" }, { name: "雇用契約書（写）", isRequired: true, note: "日本語を使う業務であること" }], dispatch: [], transfer: [] },
      renew:  { direct: [{ name: "在留期間更新許可申請書",  isRequired: true, note: "" }], dispatch: [], transfer: [] },
      change: { direct: [{ name: "在留資格変更許可申請書",  isRequired: true, note: "" }], dispatch: [], transfer: [] },
      activity:{ direct:[{ name: "就労資格証明書交付申請書",isRequired: true, note: "" }], dispatch: [], transfer: [] },
    },
  },

  // ── 6. 登録支援機関・行政書士（地域別サンプル）──
  agencies: {
    tokyo: [
      { name: "東京ビザサポートセンター", type: "登録支援機関", address: "東京都港区", tel: "03-XXXX-XXXX", visa: ["tokutei1","tokutei2"] },
      { name: "グローバル行政書士事務所", type: "行政書士",     address: "東京都新宿区", tel: "03-XXXX-XXXX", visa: ["gijinkoku","kinou","kigyo"] },
      { name: "アジア労務管理センター",   type: "登録支援機関", address: "東京都江東区", tel: "03-XXXX-XXXX", visa: ["tokutei1","kenshu"] },
    ],
    osaka: [
      { name: "大阪国際ビザ相談室",       type: "行政書士",     address: "大阪府大阪市北区", tel: "06-XXXX-XXXX", visa: ["gijinkoku","tokutei1"] },
      { name: "関西外国人雇用サポート",   type: "登録支援機関", address: "大阪府堺市",     tel: "06-XXXX-XXXX", visa: ["tokutei1","kenshu"] },
    ],
    kanagawa: [
      { name: "横浜ビザコンサルティング", type: "行政書士",     address: "神奈川県横浜市", tel: "045-XXXX-XXXX", visa: ["gijinkoku","kigyo"] },
    ],
    other: [
      { name: "全国対応：在留資格ネット", type: "行政書士",     address: "オンライン対応",  tel: "0120-XXX-XXX",  visa: ["tokutei1","gijinkoku","kinou","kigyo","kenshu","haken"] },
    ],
  },

};

// ── 7. ヘルパー関数（Logic層として分離）──
const VISA_LOGIC = {

  /** 書類リストを取得（フォールバック付き） */
  getDocs(visaId, procId, empId) {
    return (
      VISA_DATA.documents?.[visaId]?.[procId]?.[empId] ||
      VISA_DATA.documents?.[visaId]?.[procId]?.["direct"] ||
      []
    );
  },

  /** ラベル取得 */
  getLabel(type, id) {
    const map = { visa: "visas", proc: "procedures", emp: "empTypes", pref: "prefectures" };
    const arr = VISA_DATA[map[type]] || [];
    return arr.find(x => x.id === id)?.label || id;
  },

  /** pSEOメタデータ生成 */
  generateMeta(visaId, procId) {
    const v = this.getLabel("visa", visaId);
    const p = this.getLabel("proc", procId);
    return {
      title:       `${v}の${p} | 必要書類チェックリスト完全版`,
      description: `${v}で${p}を行う場合に必要な書類を一覧でチェック。雇用形態（直接雇用・派遣・企業内転勤）別に整理。入管申請前の準備に。`,
      h1:          `${v}（${p}）の必要書類リスト`,
      canonical:   `/visa-checker/${visaId}/${procId}/`,
    };
  },

  /** 地域ページのメタデータ生成 */
  generateAreaMeta(prefId) {
    const p = this.getLabel("pref", prefId);
    return {
      title:       `${p}の外国人雇用サポート | 登録支援機関・行政書士リスト`,
      description: `${p}で外国人雇用・ビザ申請をサポートする登録支援機関と行政書士の一覧。在留資格別に対応機関を検索できます。`,
      h1:          `${p}の登録支援機関・行政書士`,
      canonical:   `/visa-checker/area/${prefId}/`,
    };
  },

};
