/**
 * 負動産レスキュー：農地・山林活用ナビ — ロジック層
 * ─────────────────────────────────────────────────────
 * LAND_LOGIC.getDiagnosis(step1, step2, step3, step4) で診断結果を取得
 * visa-checker/data.js と同じ window.*** 形式でグローバル公開
 */

// ── STEP定義 ────────────────────────────────────────────────
window.LAND_DATA = {

  step1Options: [
    { id: "field",  label: "田・畑（農地）", icon: "🌾", desc: "水田・畑・果樹園など農業用地" },
    { id: "forest", label: "山林",           icon: "🌲", desc: "樹木が生育している山・丘陵地" },
    { id: "waste",  label: "原野・雑種地",   icon: "🍂", desc: "荒れ地・草地・雑種地など" },
  ],

  step2Options: [
    {
      id: "blue",
      label: "農用地区域内（青農）",
      icon: "🔵",
      desc: "農業振興地域の農用地区域。転用は原則不可",
      guide: "「農用地区域図」は市区町村の農業委員会窓口 or 農林水産省の農業振興地域整備計画で確認できます",
    },
    {
      id: "white",
      label: "白地農地",
      icon: "⬜",
      desc: "農業振興地域内だが農用地区域外。条件付きで転用可",
      guide: "農振地域内であっても農用地区域に指定されていない土地。転用許可申請が必要です",
    },
    {
      id: "urban",
      label: "市街化区域内農地",
      icon: "🏙️",
      desc: "市街化区域内の農地。届出のみで転用可",
      guide: "都市計画法の市街化区域内にある農地。農業委員会への届出のみで転用できます",
    },
    {
      id: "unknown",
      label: "わからない",
      icon: "❓",
      desc: "規制の種類がよくわからない",
      guide: "市区町村の農業委員会か農林水産省のWebで「農振地域図」を確認しましょう",
    },
  ],

  step3Options: [
    { id: "road4m", label: "幅員4m以上の公道に接している", icon: "🛣️", desc: "建築・転用に有利" },
    { id: "road2m", label: "2m程度の細い道がある",         icon: "🛤️", desc: "建築は制限あり" },
    { id: "noroad", label: "接道なし（袋地）",               icon: "🚫", desc: "再建築不可・転用困難" },
  ],

  step4Options: [
    { id: "sell",    label: "売却したい",                      icon: "💴", desc: "相続・処分・現金化" },
    { id: "lease",   label: "貸したい",                        icon: "🤝", desc: "賃貸・農地貸付・企業誘致" },
    { id: "solar",   label: "太陽光・ソーラーシェアリング",    icon: "☀️", desc: "売電収入を得たい" },
    { id: "camp",    label: "キャンプ場・体験農園",            icon: "⛺", desc: "レジャー施設として活用" },
    { id: "parking", label: "駐車場・資材置場",                icon: "🅿️", desc: "転用して収益化" },
  ],

  // 面積区分（収益シミュレーション用）
  areaOptions: [
    { id: "s",  label: "100㎡未満",       sqm: 80    },
    { id: "m",  label: "100〜500㎡",      sqm: 300   },
    { id: "l",  label: "500〜1,000㎡",   sqm: 750   },
    { id: "xl", label: "1,000〜5,000㎡", sqm: 3000  },
    { id: "xxl",label: "5,000㎡以上",    sqm: 8000  },
  ],

  // 47都道府県（地価係数計算に使用）
  prefectures: [
    { id: "hokkaido",  label: "北海道",   coef: 0.6 },
    { id: "aomori",    label: "青森県",   coef: 0.5 },
    { id: "iwate",     label: "岩手県",   coef: 0.5 },
    { id: "miyagi",    label: "宮城県",   coef: 0.7 },
    { id: "akita",     label: "秋田県",   coef: 0.5 },
    { id: "yamagata",  label: "山形県",   coef: 0.5 },
    { id: "fukushima", label: "福島県",   coef: 0.6 },
    { id: "ibaraki",   label: "茨城県",   coef: 0.7 },
    { id: "tochigi",   label: "栃木県",   coef: 0.7 },
    { id: "gunma",     label: "群馬県",   coef: 0.7 },
    { id: "saitama",   label: "埼玉県",   coef: 1.2 },
    { id: "chiba",     label: "千葉県",   coef: 1.1 },
    { id: "tokyo",     label: "東京都",   coef: 2.5 },
    { id: "kanagawa",  label: "神奈川県", coef: 1.8 },
    { id: "niigata",   label: "新潟県",   coef: 0.6 },
    { id: "toyama",    label: "富山県",   coef: 0.6 },
    { id: "ishikawa",  label: "石川県",   coef: 0.7 },
    { id: "fukui",     label: "福井県",   coef: 0.6 },
    { id: "yamanashi", label: "山梨県",   coef: 0.7 },
    { id: "nagano",    label: "長野県",   coef: 0.7 },
    { id: "gifu",      label: "岐阜県",   coef: 0.7 },
    { id: "shizuoka",  label: "静岡県",   coef: 0.9 },
    { id: "aichi",     label: "愛知県",   coef: 1.3 },
    { id: "mie",       label: "三重県",   coef: 0.7 },
    { id: "shiga",     label: "滋賀県",   coef: 0.8 },
    { id: "kyoto",     label: "京都府",   coef: 1.0 },
    { id: "osaka",     label: "大阪府",   coef: 1.5 },
    { id: "hyogo",     label: "兵庫県",   coef: 1.0 },
    { id: "nara",      label: "奈良県",   coef: 0.8 },
    { id: "wakayama",  label: "和歌山県", coef: 0.6 },
    { id: "tottori",   label: "鳥取県",   coef: 0.5 },
    { id: "shimane",   label: "島根県",   coef: 0.5 },
    { id: "okayama",   label: "岡山県",   coef: 0.7 },
    { id: "hiroshima", label: "広島県",   coef: 0.8 },
    { id: "yamaguchi", label: "山口県",   coef: 0.6 },
    { id: "tokushima", label: "徳島県",   coef: 0.6 },
    { id: "kagawa",    label: "香川県",   coef: 0.7 },
    { id: "ehime",     label: "愛媛県",   coef: 0.6 },
    { id: "kochi",     label: "高知県",   coef: 0.5 },
    { id: "fukuoka",   label: "福岡県",   coef: 1.0 },
    { id: "saga",      label: "佐賀県",   coef: 0.6 },
    { id: "nagasaki",  label: "長崎県",   coef: 0.6 },
    { id: "kumamoto",  label: "熊本県",   coef: 0.7 },
    { id: "oita",      label: "大分県",   coef: 0.6 },
    { id: "miyazaki",  label: "宮崎県",   coef: 0.6 },
    { id: "kagoshima", label: "鹿児島県", coef: 0.6 },
    { id: "okinawa",   label: "沖縄県",   coef: 1.1 },
  ],
};


// ── 補助金マスター ──────────────────────────────────────────
const _SUBSIDIES = {

  smartAgri: {
    id:     "smartAgri",
    name:   "スマート農業技術活用促進事業（農林水産省）",
    icon:   "🤖",
    color:  "#16a34a",
    amount: "最大1,000万円",
    point:  "ドローン・AI・自動農機など先端技術導入費用の最大1/2を補助。農業継続が条件。",
    badge:  "💰 高額補助",
    target: ["field"],
    step2:  ["blue", "white", "urban"],
  },

  newFarmer: {
    id:     "newFarmer",
    name:   "農業次世代人材投資資金（就農支援金）",
    icon:   "🌱",
    color:  "#15803d",
    amount: "年間最大150万円（最長5年）",
    point:  "50歳未満の新規就農者が対象。経営開始から最大5年間、年150万円の交付金。",
    badge:  "👨‍🌾 新規就農",
    target: ["field"],
    step2:  ["blue", "white", "urban"],
  },

  solarSharing: {
    id:     "solarSharing",
    name:   "営農型太陽光発電（ソーラーシェアリング）設備補助",
    icon:   "☀️",
    color:  "#d97706",
    amount: "設備費の1/3〜1/2（数百万〜数千万円）",
    point:  "農業を続けながら売電収入を確保。農地転用許可（一時転用）が必要だが農振地域でも可能な場合あり。",
    badge:  "⚡ 2026トレンド",
    target: ["field", "waste"],
    step2:  ["white", "urban", "unknown"],
  },

  forestEnv: {
    id:     "forestEnv",
    name:   "森林環境譲与税による整備補助（市町村事業）",
    icon:   "🌳",
    color:  "#065f46",
    amount: "伐採・整備費用の最大2/3",
    point:  "2024年から森林環境税が開始。市町村経由で間伐・路網整備・林業参入支援が受けられる。",
    badge:  "🌿 森林整備",
    target: ["forest"],
    step2:  ["blue", "white", "urban", "unknown"],
  },

  abandonedLand: {
    id:     "abandonedLand",
    name:   "耕作放棄地再生利用緊急対策交付金",
    icon:   "♻️",
    color:  "#0891b2",
    amount: "10〜50万円/10a",
    point:  "5年以上耕作されていない農地を再生利用する場合に交付。農業委員会への申請が必要。",
    badge:  "🔄 再生支援",
    target: ["field", "waste"],
    step2:  ["white", "unknown"],
  },

  inheritance: {
    id:     "inheritance",
    name:   "相続土地国庫帰属制度（法務省）",
    icon:   "🏛️",
    color:  "#6b7280",
    amount: "負担金：面積×地価相当額（概算20〜50万円）",
    point:  "2023年4月開始。建物・抵当権なしで管理困難な土地を国に引き渡せる制度。農地・山林も対象。",
    badge:  "📤 手放す",
    target: ["field", "forest", "waste"],
    step2:  ["blue", "white", "urban", "unknown"],
  },

  farmlandBank: {
    id:     "farmlandBank",
    name:   "農地中間管理機構（農地バンク）への貸付",
    icon:   "🏦",
    color:  "#1d4ed8",
    amount: "賃料：1〜5万円/10a/年（地域・地目による）",
    point:  "都道府県の農地バンクを通じて担い手農家に貸すことで安定賃料が得られる。管理負担ゼロ。",
    badge:  "🤝 貸出安定",
    target: ["field"],
    step2:  ["blue", "white", "urban"],
  },
};


// ── 収益シミュレーション設定 ────────────────────────────────
const _REVENUE = {
  solar: {
    label:     "ソーラーシェアリング（売電収入）",
    perSqmYear: 500,   // 円/㎡/年（農地上設置の概算）
    note:      "※発電量・FIT価格・設備費回収期間により変動",
  },
  camp: {
    label:     "キャンプ場・グランピング",
    perSqmYear: 200,   // 円/㎡/年
    note:      "※設備投資・集客力・立地により大きく変動",
  },
  parking: {
    label:     "駐車場・資材置場",
    perSqmYear: 800,   // 円/㎡/年（地方平均）
    note:      "※都市部はさらに高い。月極駐車場想定",
  },
  farmBank: {
    label:     "農地バンク賃貸（年間賃料）",
    perSqmYear: 15,    // 円/㎡/年（1,500円/10a）
    note:      "※地域・地目・農地質により変動",
  },
};


// ── メインロジック ──────────────────────────────────────────
window.LAND_LOGIC = {

  /**
   * 4ステップの選択内容から診断結果を生成
   * @param {string} step1   - 土地種別 (field/forest/waste)
   * @param {string} step2   - 規制種別 (blue/white/urban/unknown)
   * @param {string} step3   - 接道状況 (road4m/road2m/noroad)
   * @param {string} step4   - 活用目的 (sell/lease/solar/camp/parking)
   * @param {string} areaId  - 面積区分 (s/m/l/xl/xxl)
   * @param {string} prefId  - 都道府県ID
   * @returns {Object} 診断結果
   */
  getDiagnosis(step1, step2, step3, step4, areaId, prefId) {
    const difficulty = this._getDifficulty(step1, step2, step3);
    const exits      = this._getExits(step1, step2, step3, step4);
    const subsidies  = this._getSubsidies(step1, step2);
    const revenue    = this._calcRevenue(step4, areaId, prefId);
    const procedure  = this._getProcedure(step1, step2, step3);
    const message    = this._buildMessage(difficulty, exits, revenue);

    return { difficulty, exits, subsidies, revenue, procedure, message };
  },

  // ── 難易度判定 ─────────────────────────────────────────────
  _getDifficulty(step1, step2, step3) {
    // 接道なし
    if (step3 === "noroad") return {
      level: "超困難",
      color: "#dc2626",
      icon:  "🚨",
      label: "転用・売却は極めて困難",
      desc:  "接道なし（袋地）のため建築物の建設が不可。農地転用後の利活用も大きく制限されます。農地バンクへの貸付か国庫帰属を検討してください。",
    };
    // 青農
    if (step2 === "blue") return {
      level: "難関",
      color: "#d97706",
      icon:  "⚠️",
      label: "農用地区域内：転用は原則不可",
      desc:  "農業振興地域の農用地区域内（青農）のため、転用許可は原則下りません。農振除外（農用地利用計画の変更）の申請が必要で、数年かかる場合もあります。農業継続かソーラーシェアリングの検討を推奨します。",
    };
    // 山林
    if (step1 === "forest") return {
      level: "要確認",
      color: "#0891b2",
      icon:  "🌲",
      label: "山林：森林法の規制を確認",
      desc:  "1ha以上の開発は都道府県知事の許可が必要です。林業への転換や森林バンクへの貸付、間伐補助金の活用が現実的な選択肢です。",
    };
    // 市街化区域
    if (step2 === "urban") return {
      level: "有利",
      color: "#16a34a",
      icon:  "✅",
      label: "市街化区域：届出のみで転用可",
      desc:  "農業委員会への届出のみで転用できます。駐車場・資材置場・太陽光発電など幅広い活用が可能です。売却・貸付ともに有利な条件です。",
    };
    // 白地
    if (step2 === "white") return {
      level: "可能性あり",
      color: "#2563eb",
      icon:  "🔵",
      label: "白地農地：条件付きで転用可",
      desc:  "農地転用許可申請（農地法4・5条）が必要ですが、許可が下りれば幅広い活用が可能です。農業委員会への事前相談をおすすめします。",
    };
    return {
      level: "要確認",
      color: "#6b7280",
      icon:  "❓",
      label: "規制確認が必要",
      desc:  "まず市区町村の農業委員会に相談し、土地の規制種別（農振地域・農用地区域）を確認してください。",
    };
  },

  // ── 出口戦略 ───────────────────────────────────────────────
  _getExits(step1, step2, step3, step4) {
    const exits = [];

    // A案：農地として活かす
    if (step1 === "field") {
      exits.push({
        id:    "A",
        label: "A案：農地として活かす（攻め）",
        icon:  "🌾",
        color: "#15803d",
        bg:    "#f0fdf4",
        items: [
          "農地バンク（農地中間管理機構）に貸し出して安定賃料を得る",
          "スマート農業（ドローン・AIなど）を導入して収益性を高める",
          "新規就農者に売却・貸付して農業継承支援金を活用する",
        ],
        feasibility: step2 === "blue" ? "高（農業継続が最も現実的）" : "中",
      });
    }

    // B案：転用して収益化
    if (step2 !== "blue" || step1 !== "field") {
      const canConvert = step2 === "urban" || step2 === "white";
      exits.push({
        id:    "B",
        label: "B案：転用して収益化（守り）",
        icon:  "💡",
        color: "#d97706",
        bg:    "#fffbeb",
        items: [
          step4 === "solar"   ? "☀️ ソーラーシェアリング：農業を続けながら売電収入" : null,
          step4 === "camp"    ? "⛺ キャンプ場・グランピング：レジャー需要を取り込む" : null,
          step4 === "parking" ? "🅿️ 駐車場・資材置場：低コストで安定収入" : null,
          canConvert          ? "🏭 資材置場・倉庫：工場・製造業向けニッチ需要" : null,
          step1 === "forest"  ? "🪵 林業・木材販売：間伐材・薪・チップ材として出荷" : null,
          "🚁 ドローン練習場：免許取得スクール向け需要が急増中（地目変更不要な場合あり）",
        ].filter(Boolean),
        feasibility: canConvert ? "高" : step2 === "blue" ? "要農振除外" : "中",
      });
    }

    // 2026トレンド：ソーラーシェアリング
    if (step1 === "field" || step1 === "waste") {
      exits.push({
        id:    "SOLAR",
        label: "🔥 2026年トレンド：営農型太陽光（ソーラーシェアリング）",
        icon:  "☀️",
        color: "#b45309",
        bg:    "#fef3c7",
        items: [
          "農業を続けながら太陽光パネルを設置し売電収入を得るハイブリッド型",
          "農振地域内でも「一時転用」として許可が下りるケースあり",
          "FIT（固定価格買取制度）価格：2026年度 約12円/kWh",
          "初期投資：1,000〜3,000万円。回収期間の目安：10〜15年",
        ],
        feasibility: step2 === "noroad" ? "低（接道なし）" : "中〜高",
      });
    }

    // C案：手放す
    exits.push({
      id:    "C",
      label: "C案：手放す（最終手段）",
      icon:  "📤",
      color: "#6b7280",
      bg:    "#f9fafb",
      items: [
        "相続土地国庫帰属制度：法務局に申請し国に引き渡す（負担金が必要）",
        "農地バンクを通じた売却・貸付（無償含む）",
        "NPO・市民農園・企業農場への寄付・売却",
        step1 === "forest" ? "森林バンクや森林組合を通じた売却・委託" : null,
      ].filter(Boolean),
      feasibility:
        step3 === "noroad" ? "高（国庫帰属が現実的）" :
        step2 === "blue"   ? "中（農地バンク活用）" : "中",
    });

    return exits;
  },

  // ── 補助金マッチング ───────────────────────────────────────
  _getSubsidies(step1, step2) {
    return Object.values(_SUBSIDIES).filter(s => {
      const targetOk = s.target.includes(step1);
      const step2Ok  = s.step2.includes(step2);
      return targetOk && step2Ok;
    });
  },

  // ── 収益シミュレーション ───────────────────────────────────
  _calcRevenue(step4, areaId, prefId) {
    const area = (window.LAND_DATA.areaOptions.find(a => a.id === areaId) || { sqm: 300 }).sqm;
    const pref = (window.LAND_DATA.prefectures.find(p => p.id === prefId) || { coef: 0.7 });
    const coef = pref.coef;

    const revenueKey = {
      solar:   "solar",
      camp:    "camp",
      parking: "parking",
      lease:   "farmBank",
      sell:    null,
    }[step4];

    if (!revenueKey) return null;

    const rev    = _REVENUE[revenueKey];
    const annual = Math.round(area * rev.perSqmYear * coef / 10000) * 10000; // 1万円単位

    return {
      label:       rev.label,
      annualYen:   annual,
      annualLabel: this.formatAmount(annual),
      monthlyLabel: this.formatAmount(Math.round(annual / 12 / 1000) * 1000),
      area,
      note:        rev.note,
    };
  },

  // ── 手続きガイド ───────────────────────────────────────────
  _getProcedure(step1, step2, step3) {
    const steps = [];

    if (step2 === "unknown") {
      steps.push({ order: 1, label: "規制確認", desc: "市区町村の農業委員会窓口で農振地域・農用地区域の確認" });
    }
    if (step2 === "blue") {
      steps.push({ order: 1, label: "農振除外申請", desc: "農用地利用計画の変更申請（年1〜2回の受付。数年かかる場合あり）" });
    }
    if (step2 === "white") {
      steps.push({ order: 1, label: "農地転用許可申請", desc: "農地法4条（自己転用）or 5条（転用目的の権利移転）の許可申請" });
    }
    if (step2 === "urban") {
      steps.push({ order: 1, label: "農業委員会への届出", desc: "許可不要・届出のみ。2〜4週間で手続き完了" });
    }
    if (step1 === "forest") {
      steps.push({ order: 1, label: "林地開発許可（1ha以上）", desc: "都道府県知事への森林法に基づく林地開発許可申請" });
    }

    steps.push({ order: steps.length + 1, label: "農業委員会への事前相談", desc: "いずれの場合も農業委員会への事前相談が最初のステップ。無料で相談可" });
    steps.push({ order: steps.length + 1, label: "現地調査・測量", desc: "境界確認・面積測量（隣地との境界が不明な場合は土地家屋調査士に依頼）" });

    if (step3 === "noroad") {
      steps.push({ order: steps.length + 1, label: "相続土地国庫帰属の相談", desc: "法務局（法務省）への相談。審査期間：6ヶ月〜1年程度" });
    }

    return steps;
  },

  // ── メッセージ生成 ─────────────────────────────────────────
  _buildMessage(difficulty, exits, revenue) {
    const level = difficulty.level;

    if (level === "有利") return {
      headline: "この土地は活用のチャンスがあります！",
      sub:      "市街化区域内農地は届出のみで転用可能。駐車場・太陽光・売却など選択肢が豊富です。",
      tone:     "excellent",
    };
    if (level === "可能性あり") return {
      headline: "条件次第で転用・活用できます",
      sub:      "農業委員会への転用許可申請が必要ですが、許可が下りれば幅広い活用が可能です。まず事前相談を。",
      tone:     "good",
    };
    if (level === "難関") return {
      headline: "農用地区域内（青農）のため転用は難しいですが、農業継続・ソーラーシェアリングで収益化できます",
      sub:      "農振除外を目指すか、農業を続けながらスマート農業・ソーラーシェアリングで収益化を検討しましょう。",
      tone:     "caution",
    };
    if (level === "超困難") return {
      headline: "接道なし（袋地）のため建築・転用は困難です",
      sub:      "農地バンクへの無償貸付か、相続土地国庫帰属制度での処分が現実的な選択肢です。",
      tone:     "hard",
    };
    return {
      headline: "まず農業委員会に相談して規制種別を確認しましょう",
      sub:      "土地の規制内容によって活用方法が大きく変わります。市区町村の農業委員会に無料相談できます。",
      tone:     "normal",
    };
  },

  // ── pSEOメタデータ ─────────────────────────────────────────
  generateMeta(prefId, cityName) {
    const pref = (window.LAND_DATA.prefectures.find(p => p.id === prefId) || {}).label || "";
    const loc  = cityName ? `${pref}${cityName}` : pref;
    return {
      title:       `${loc}の農地・山林活用ナビ | 負動産レスキュー | All AI Toolbox`,
      description: `${loc}の農地・山林・原野の転用可否・活用方法・補助金を4ステップで診断。ソーラーシェアリング・農地バンク・国庫帰属制度に対応。`,
      h1:          `${loc} 農地・山林の活用方法を診断`,
      canonical:   `/land-nav/${prefId}/`,
    };
  },

  // ── ユーティリティ ─────────────────────────────────────────
  formatAmount(amount) {
    if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}億円`;
    if (amount >= 10000)     return `${Math.floor(amount / 10000).toLocaleString()}万円`;
    return `${amount.toLocaleString()}円`;
  },

  getLabel(type, id) {
    const map = {
      pref:  window.LAND_DATA.prefectures,
      step1: window.LAND_DATA.step1Options,
      step2: window.LAND_DATA.step2Options,
      step3: window.LAND_DATA.step3Options,
      step4: window.LAND_DATA.step4Options,
      area:  window.LAND_DATA.areaOptions,
    };
    const found = (map[type] || []).find(i => i.id === id);
    return found ? found.label : id;
  },
};
