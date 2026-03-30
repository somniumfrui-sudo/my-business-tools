/**
 * 外国人雇用 助成金シミュレーター — ロジック層
 * ─────────────────────────────────────────────
 * GRANT_LOGIC.getGrants(step1, step2, step3, prefId) で助成金リストを取得
 * GRANT_LOGIC.calcTotal(grants) で合計金額を計算
 *
 * visa-checker/data.js と同じ window.*** 形式でグローバル公開
 */

// ── STEP定義 ────────────────────────────────────────────────
window.GRANT_DATA = {

  // 47都道府県（data.js に依存しないよう直接定義）
  prefectures: [
    { id: "hokkaido",  label: "北海道" }, { id: "aomori",    label: "青森県" },
    { id: "iwate",     label: "岩手県" }, { id: "miyagi",    label: "宮城県" },
    { id: "akita",     label: "秋田県" }, { id: "yamagata",  label: "山形県" },
    { id: "fukushima", label: "福島県" }, { id: "ibaraki",   label: "茨城県" },
    { id: "tochigi",   label: "栃木県" }, { id: "gunma",     label: "群馬県" },
    { id: "saitama",   label: "埼玉県" }, { id: "chiba",     label: "千葉県" },
    { id: "tokyo",     label: "東京都" }, { id: "kanagawa",  label: "神奈川県" },
    { id: "niigata",   label: "新潟県" }, { id: "toyama",    label: "富山県" },
    { id: "ishikawa",  label: "石川県" }, { id: "fukui",     label: "福井県" },
    { id: "yamanashi", label: "山梨県" }, { id: "nagano",    label: "長野県" },
    { id: "gifu",      label: "岐阜県" }, { id: "shizuoka",  label: "静岡県" },
    { id: "aichi",     label: "愛知県" }, { id: "mie",       label: "三重県" },
    { id: "shiga",     label: "滋賀県" }, { id: "kyoto",     label: "京都府" },
    { id: "osaka",     label: "大阪府" }, { id: "hyogo",     label: "兵庫県" },
    { id: "nara",      label: "奈良県" }, { id: "wakayama",  label: "和歌山県" },
    { id: "tottori",   label: "鳥取県" }, { id: "shimane",   label: "島根県" },
    { id: "okayama",   label: "岡山県" }, { id: "hiroshima", label: "広島県" },
    { id: "yamaguchi", label: "山口県" }, { id: "tokushima", label: "徳島県" },
    { id: "kagawa",    label: "香川県" }, { id: "ehime",     label: "愛媛県" },
    { id: "kochi",     label: "高知県" }, { id: "fukuoka",   label: "福岡県" },
    { id: "saga",      label: "佐賀県" }, { id: "nagasaki",  label: "長崎県" },
    { id: "kumamoto",  label: "熊本県" }, { id: "oita",      label: "大分県" },
    { id: "miyazaki",  label: "宮崎県" }, { id: "kagoshima", label: "鹿児島県" },
    { id: "okinawa",   label: "沖縄県" },
  ],

  step1Options: [
    { id: "conversion",  label: "有期雇用から正社員へ転換したい",          icon: "🔄" },
    { id: "trial",       label: "未経験の外国人を試行雇用（トライアル）したい", icon: "🤝" },
    { id: "training",    label: "すでに雇用している外国人の教育をしたい",    icon: "📚" },
    { id: "environment", label: "職場環境の整備（多言語化等）をしたい",      icon: "🌐" },
  ],

  step2Options: [
    { id: "sme",   label: "中小企業", desc: "資本金3億円以下 または 従業員300人以下" },
    { id: "large", label: "大企業",   desc: "上記以外の企業" },
  ],

  step3Options: [
    { id: "it",     label: "IT機器・設備投資を行う",      icon: "💻" },
    { id: "raise",  label: "賃金を3%以上アップさせる",    icon: "📈" },
    { id: "train",  label: "100時間以上の専門訓練を実施する", icon: "🎓" },
    { id: "none",   label: "特になし",                    icon: "—"  },
  ],

  // 自治体加算が手厚い都道府県
  bonusPrefectures: {
    tokyo:     { label: "東京都",   amount: 200000, note: "東京都中小企業外国人材支援事業" },
    gunma:     { label: "群馬県",   amount: 150000, note: "ぐんま外国人材活躍促進補助金" },
    hokkaido:  { label: "北海道",   amount: 150000, note: "北海道外国人雇用促進支援補助金" },
    aichi:     { label: "愛知県",   amount: 150000, note: "愛知県外国人材就労環境整備助成" },
    osaka:     { label: "大阪府",   amount: 150000, note: "大阪府外国人労働者定着支援補助金" },
    fukuoka:   { label: "福岡県",   amount: 100000, note: "福岡県外国人雇用サポート補助金" },
    saitama:   { label: "埼玉県",   amount: 100000, note: "埼玉県外国人材確保支援補助金" },
    kanagawa:  { label: "神奈川県", amount: 100000, note: "神奈川県外国人材活用促進助成金" },
    chiba:     { label: "千葉県",   amount: 100000, note: "千葉県外国人労働者支援補助金" },
    shizuoka:  { label: "静岡県",   amount: 100000, note: "静岡県外国人材定着促進補助金" },
    hiroshima: { label: "広島県",   amount: 100000, note: "ひろしま外国人材活躍支援補助金" },
    miyagi:    { label: "宮城県",   amount: 100000, note: "宮城県外国人雇用定着支援助成" },
  },
};


// ── 助成金マスターデータ ──────────────────────────────────
const _GRANTS = {

  // ① キャリアアップ助成金（正社員化コース）
  careerUp: {
    id:       "careerUp",
    name:     "キャリアアップ助成金（正社員化コース）",
    icon:     "🔄",
    color:    "#2563eb",
    amount: {
      sme:   1150000,  // 中小: 最大115万円（情報開示加算20万含む）
      large:  860000,  // 大企業: 最大86万円
    },
    amountLabel: {
      sme:   "最大115万円",
      large: "最大86万円",
    },
    point:  "有期→正規転換後6か月の賃金支払い後に申請。転換日前後で就業規則の整備が必須です。",
    badge:  "👑 最高額",
    conditions: ["conversion"],  // この step1 に該当
    step2:  ["sme","large"],
    step3:  null,  // step3 不問
  },

  // ① キャリアアップ（賃金アップ加算）
  careerUpRaise: {
    id:       "careerUpRaise",
    name:     "キャリアアップ助成金（賃金規定等改定コース）",
    icon:     "📈",
    color:    "#2563eb",
    amount: {
      sme:   480000,
      large: 320000,
    },
    amountLabel: {
      sme:   "最大48万円",
      large: "最大32万円",
    },
    point:  "全労働者の賃金を3%以上引き上げ、就業規則に明記することが条件。",
    badge:  "💡 加算あり",
    conditions: ["conversion","environment"],
    step2:  ["sme","large"],
    step3:  ["raise"],
  },

  // ② トライアル雇用助成金
  trial: {
    id:       "trial",
    name:     "トライアル雇用助成金（一般トライアルコース）",
    icon:     "🤝",
    color:    "#059669",
    amount: {
      sme:   120000,  // 月4万×3ヶ月
      large: 120000,
    },
    amountLabel: {
      sme:   "最大12万円",
      large: "最大12万円",
    },
    point:  "ハローワーク経由で求人票を出し、採用後すぐに申請。3か月後に正規転換が目標。",
    badge:  "⚡ 即申請可",
    conditions: ["trial"],
    step2:  ["sme","large"],
    step3:  null,
  },

  // ③ 人材開発支援助成金（人への投資促進コース）
  hrDevelopment: {
    id:       "hrDevelopment",
    name:     "人材開発支援助成金（人への投資促進コース）",
    icon:     "📚",
    color:    "#7c3aed",
    amount: {
      sme:   1500000,  // 訓練＋設備投資で最大150万円（2026年新設）
      large:  750000,
    },
    amountLabel: {
      sme:   "最大150万円",
      large: "最大75万円",
    },
    point:  "100時間以上の訓練計画書をハローワークに事前提出。IT設備との併用でさらに加算。",
    badge:  "🆕 2026年新設",
    conditions: ["training"],
    step2:  ["sme","large"],
    step3:  ["train","it"],
  },

  // ③ 人材開発支援（IT設備加算）
  hrDevelopmentIT: {
    id:       "hrDevelopmentIT",
    name:     "人材開発支援助成金（デジタル・DX推進加算）",
    icon:     "💻",
    color:    "#7c3aed",
    amount: {
      sme:   500000,
      large: 250000,
    },
    amountLabel: {
      sme:   "最大50万円",
      large: "最大25万円",
    },
    point:  "IT機器・ソフトウェアの購入費用を訓練と一体で申請。見積書を先に取っておくこと。",
    badge:  "💻 IT加算",
    conditions: ["training","environment"],
    step2:  ["sme","large"],
    step3:  ["it"],
  },

  // ④ 人材確保等支援助成金（雇用管理改善計画）
  hrSupport: {
    id:       "hrSupport",
    name:     "人材確保等支援助成金（雇用管理改善計画コース）",
    icon:     "🌐",
    color:    "#d97706",
    amount: {
      sme:   720000,
      large: 480000,
    },
    amountLabel: {
      sme:   "最大72万円",
      large: "最大48万円",
    },
    point:  "就業規則の多言語化・社内相談窓口の設置・通訳費用が対象。2年間の計画認定が必要。",
    badge:  "🌐 多言語対応",
    conditions: ["environment","training","conversion"],
    step2:  ["sme","large"],
    step3:  null,
  },

  // ⑤ 職場定着支援助成金（外国人労働者雇用管理改善コース）
  retention: {
    id:       "retention",
    name:     "職場定着支援助成金（外国人労働者雇用管理改善コース）",
    icon:     "🏠",
    color:    "#0891b2",
    amount: {
      sme:   280000,
      large: 200000,
    },
    amountLabel: {
      sme:   "最大28万円",
      large: "最大20万円",
    },
    point:  "外国人労働者の離職率改善・生活支援（住居確保等）を実施した場合に支給。",
    badge:  "🏠 定着支援",
    conditions: ["environment","trial","conversion"],
    step2:  ["sme","large"],
    step3:  null,
  },

};


// ── メインロジック ──────────────────────────────────────────
window.GRANT_LOGIC = {

  /**
   * 選択内容に基づき受給可能性のある助成金リストを返す
   * @param {string} step1   - 雇用形態ID
   * @param {string} step2   - 企業規模ID ("sme" or "large")
   * @param {string} step3   - アクションID
   * @param {string} prefId  - 都道府県ID
   * @returns {{ grants: Array, localBonus: Object|null, totalAmount: number, message: string }}
   */
  getGrants(step1, step2, step3, prefId) {
    const matched = [];

    Object.values(_GRANTS).forEach(g => {
      // step1 チェック
      if (!g.conditions.includes(step1)) return;
      // step2 チェック
      if (!g.step2.includes(step2)) return;
      // step3 チェック（nullは不問）
      if (g.step3 !== null && step3 !== "none" && !g.step3.includes(step3)) return;
      // step3が "none" の場合、step3必須の助成金は除外
      if (step3 === "none" && g.step3 !== null) return;

      matched.push({
        ...g,
        estimatedAmount: g.amount[step2],
        estimatedLabel:  g.amountLabel[step2],
      });
    });

    // 自治体加算
    const localBonus = window.GRANT_DATA.bonusPrefectures[prefId] || {
      label:  this._getPrefLabel(prefId),
      amount: 100000,
      note:   "自治体独自の外国人材支援補助金（要問合せ）",
    };

    // 合計金額
    const total = this.calcTotal(matched, localBonus);

    // ポジティブメッセージ
    const message = this._buildMessage(matched, total, step2);

    return {
      grants:      matched,
      localBonus,
      totalAmount: total,
      message,
    };
  },

  /**
   * 合計金額を計算
   */
  calcTotal(grants, localBonus) {
    const grantTotal = grants.reduce((sum, g) => sum + g.estimatedAmount, 0);
    const bonus      = localBonus ? localBonus.amount : 0;
    return grantTotal + bonus;
  },

  /**
   * 合計金額を「◯◯万円」形式にフォーマット
   */
  formatAmount(amount) {
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000).toLocaleString()}万円`;
    }
    return `${amount.toLocaleString()}円`;
  },

  /**
   * ポジティブメッセージを生成
   */
  _buildMessage(grants, total, step2) {
    const count  = grants.length;
    const label  = this.formatAmount(total);
    const isSme  = step2 === "sme";

    if (count === 0) return {
      headline: "条件を変えると対象になる可能性があります",
      sub:      "STEP 1〜3の選択を見直してみてください。",
      tone:     "neutral",
    };

    if (total >= 2000000) return {
      headline: `最大 ${label} の受給が見込めます！`,
      sub:      `${count}種類の助成金が対象です。${isSme ? "中小企業向けの上乗せも充実しています。" : "計画的に申請を進めましょう。"}`,
      tone:     "excellent",
    };

    if (total >= 1000000) return {
      headline: `最大 ${label} が受給できる可能性があります`,
      sub:      `${count}種類の助成金が条件に合致しています。早めの計画立案がカギです。`,
      tone:     "good",
    };

    return {
      headline: `最大 ${label} の助成金に申請できます`,
      sub:      `${count}種類の助成金が対象です。まずは管轄のハローワークへ相談してみましょう。`,
      tone:     "normal",
    };
  },

  /**
   * 都道府県ラベルを返すユーティリティ
   */
  _getPrefLabel(prefId) {
    const found = (window.VISA_DATA?.prefectures || []).find(p => p.id === prefId);
    return found ? found.label : prefId;
  },

  /**
   * pSEOメタデータ生成
   */
  generateMeta(step1Id) {
    const step1 = window.GRANT_DATA.step1Options.find(s => s.id === step1Id);
    const label = step1 ? step1.label : "外国人雇用";
    return {
      title:       `${label}で使える助成金シミュレーター | All AI Toolbox`,
      description: `${label}で申請できる助成金を自動診断。キャリアアップ助成金・人材開発支援助成金など最新2026年基準で概算金額を表示します。`,
      h1:          `${label} 受給可能助成金シミュレーション`,
      canonical:   `/grant-checker/${step1Id}/`,
    };
  },

  /**
   * 全組み合わせのURL一覧（sitemap用）
   */
  getAllUrls() {
    return window.GRANT_DATA.step1Options.map(s => `/grant-checker/${s.id}/`);
  },
};
