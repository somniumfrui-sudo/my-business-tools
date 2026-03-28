/**
 * 外国人ビザ書類チェッカー データベース
 * ─────────────────────────────────────────
 * ※ id はすべて英数字・ハイフンのみ（URL・キーに使用するため）
 * ※ agencies の構造: { name, type, address, tel, visa[] }
 */
const VISA_DATA = {

  // ── STEP 1: 在留資格 ──────────────────────────────────────
  visas: [
    { id: "tokutei1",  label: "特定技能1号",           slug: "tokutei1",  color: "#2563eb" },
    { id: "gijinkoku", label: "技術・人文知識・国際業務", slug: "gijinkoku", color: "#1d4ed8" },
    { id: "koudo",     label: "高度専門職",             slug: "hsp",       color: "#1e40af" },
    { id: "kazoku",    label: "家族滞在",               slug: "dependent", color: "#3b82f6" },
  ],

  // ── STEP 2: 手続きの種類 ──────────────────────────────────
  procedures: [
    { id: "renew",  label: "更新（期間延長）"         },
    { id: "change", label: "変更（別のビザから）"     },
    { id: "new",    label: "新規（海外から呼び寄せ）" },
  ],

  // ── STEP 3: 雇用形態 ──────────────────────────────────────
  // ⚠ id は英数字のみ（URLパラメータ・オブジェクトキーに使用）
  // 修正前: { id: "派遣", ... }  → 日本語IDはURLで壊れる
  // 修正後: { id: "dispatch", ... }
  empTypes: [
    { id: "direct",   label: "直接雇用（正社員・契約）" },
    { id: "dispatch", label: "労働者派遣"               },
  ],

  // ── 都道府県 ──────────────────────────────────────────────
  prefectures: [
    { id: "tokyo",   label: "東京都",  office: "東京出入国在留管理局"   },
    { id: "osaka",   label: "大阪府",  office: "大阪出入国在留管理局"   },
    { id: "aichi",   label: "愛知県",  office: "名古屋出入国在留管理局" },
    { id: "fukuoka", label: "福岡県",  office: "福岡出入国在留管理局"   },
  ],

  // ── 地域別の相談先 ────────────────────────────────────────
  // 修正前: { name, type, address, tags[] }  → tel・visa[] が不足
  // 修正後: { name, type, address, tel, visa[] }
  agencies: {
    tokyo: [
      {
        name:    "東京出入国在留管理局",
        type:    "登録支援機関",
        address: "東京都港区港南5-5-30",
        tel:     "0570-034259",
        visa:    ["tokutei1", "gijinkoku", "koudo", "kazoku"],
      },
      {
        name:    "新宿行政書士事務所（サンプル）",
        type:    "行政書士",
        address: "東京都新宿区",
        tel:     "03-XXXX-XXXX",
        visa:    ["tokutei1", "gijinkoku"],
      },
    ],
    osaka: [
      {
        name:    "大阪出入国在留管理局",
        type:    "登録支援機関",
        address: "大阪府大阪市住之江区南港北1-29-53",
        tel:     "0570-064259",
        visa:    ["tokutei1", "gijinkoku", "koudo", "kazoku"],
      },
    ],
    aichi: [
      {
        name:    "名古屋出入国在留管理局",
        type:    "登録支援機関",
        address: "愛知県名古屋市港区正保町5-18",
        tel:     "0570-034259",
        visa:    ["tokutei1", "gijinkoku", "koudo", "kazoku"],
      },
    ],
    fukuoka: [
      {
        name:    "福岡出入国在留管理局",
        type:    "登録支援機関",
        address: "福岡県福岡市博多区博多駅東2-10-7",
        tel:     "0570-064259",
        visa:    ["tokutei1", "gijinkoku", "koudo", "kazoku"],
      },
    ],
  },
};


/**
 * 書類判定ロジック＋ヘルパー関数
 * ─────────────────────────────────────────
 * index.html のUIロジックから呼ばれる唯一のインターフェース。
 * 書類を増やすときは getDocs() に条件を追記するだけ。
 */
const VISA_LOGIC = {

  // ── ラベル取得 ────────────────────────────────────────────
  getLabel(type, id) {
    const maps = {
      visa: VISA_DATA.visas,
      proc: VISA_DATA.procedures,
      emp:  VISA_DATA.empTypes,
      pref: VISA_DATA.prefectures,
    };
    return maps[type]?.find(item => item.id === id)?.label || id;
  },

  // ── 書類リスト判定 ────────────────────────────────────────
  // 優先順位: visa + proc の完全一致 → フォールバック（共通書類）
  getDocs(visaId, procId, empId) {

    // 共通書類（すべての申請に必要）
    const common = [
      { name: "申請書（所定様式）",         isRequired: true,  note: "顔写真（4×3cm）を貼付" },
      { name: "パスポートおよび在留カード", isRequired: true,  note: "原本提示（コピー不可）" },
    ];

    // ── 特定技能1号 ──────────────────────────────────────────
    if (visaId === "tokutei1") {
      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書",   isRequired: true,  note: "入管様式第6号" },
        { name: "特定技能雇用契約書（写）",       isRequired: true,  note: "報酬額・労働条件を明記" },
        { name: "技能測定試験合格証明書",         isRequired: true,  note: "特定産業分野の試験" },
        { name: "日本語能力試験 合格証書",        isRequired: true,  note: "N4以上またはA2以上" },
        { name: "健康診断個人票",                 isRequired: true,  note: "指定様式による" },
        { name: "事前ガイダンス確認書",           isRequired: true,  note: "" },
        { name: "登録支援機関との委託契約書",     isRequired: false, condition: "登録支援機関に委託する場合のみ" },
      ];
      if (procId === "renew") return [
        ...common,
        { name: "特定技能外国人の報酬に関する説明書", isRequired: true,  note: "" },
        { name: "健康診断個人票",                     isRequired: true,  note: "受診から1年以内のもの" },
        { name: "給与所得の源泉徴収票",               isRequired: true,  note: "前年分" },
        { name: "住民税の課税・納税証明書",           isRequired: true,  note: "直近1年分" },
        { name: "社会保険料納付証明書",               isRequired: false, condition: "支払い遅延がないことを証明する場合" },
        { name: "登録支援機関との委託契約継続書類",   isRequired: false, condition: "委託を継続する場合のみ" },
      ];
      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",   isRequired: true, note: "" },
        { name: "技能測定試験合格証明書",   isRequired: true, note: "変更後の資格に対応したもの" },
        { name: "特定技能雇用契約書（写）", isRequired: true, note: "新しい契約書" },
        { name: "変更前の活動を証明する書類", isRequired: true, note: "直近の源泉徴収票等" },
      ];
    }

    // ── 技術・人文知識・国際業務 ────────────────────────────
    if (visaId === "gijinkoku") {
      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書", isRequired: true,  note: "" },
        { name: "大学・専門学校の卒業証明書",   isRequired: true,  note: "学歴要件を満たすもの" },
        { name: "成績証明書",                   isRequired: true,  note: "専攻と職務の関連性を示す" },
        { name: "採用理由書",                   isRequired: true,  note: "日本語で職務内容と専攻の関連を詳述" },
        { name: "雇用契約書（写）",             isRequired: true,  note: "労働条件・報酬額を明記" },
        { name: "登記事項証明書（法人）",       isRequired: true,  note: "3ヶ月以内取得" },
        { name: "会社の決算書（写）",           isRequired: true,  note: "直近1〜2期分" },
        { name: "会社のパンフレット",           isRequired: true,  note: "事業内容の説明" },
      ];
      if (procId === "renew") return [
        ...common,
        { name: "直近の住民税の課税・納税証明書", isRequired: true,  note: "直近1年分" },
        { name: "在職証明書",                     isRequired: true,  note: "雇用継続を示すもの" },
        { name: "直近の給与明細（3ヶ月分）",     isRequired: true,  note: "" },
        { name: "源泉徴収票（写）",               isRequired: true,  note: "直近1年分" },
        { name: "決算報告書の写し",               isRequired: true,  note: "勤務先の最新の決算書" },
        { name: "雇用契約書の写し",               isRequired: false, condition: "契約内容に変更がある場合" },
      ];
      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",                   isRequired: true, note: "" },
        { name: "採用理由書",                               isRequired: true, note: "変更後の職務と専攻の関連" },
        { name: "雇用契約書（写）",                         isRequired: true, note: "" },
        { name: "学歴・職歴を証する書類",                   isRequired: true, note: "" },
        { name: "変更前の在留資格の活動内容を証明する書類", isRequired: true, note: "" },
      ];
    }

    // ── 高度専門職 ───────────────────────────────────────────
    if (visaId === "koudo") {
      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書",     isRequired: true, note: "" },
        { name: "高度人材ポイント計算表",           isRequired: true, note: "法務省の計算シートを使用" },
        { name: "学歴・職歴・年収を証明する書類",   isRequired: true, note: "ポイント項目ごとに用意" },
        { name: "雇用契約書（写）",                 isRequired: true, note: "年収を明示" },
        { name: "登記事項証明書",                   isRequired: true, note: "" },
      ];
      if (procId === "renew") return [
        ...common,
        { name: "高度人材ポイント計算表（最新）", isRequired: true, note: "" },
        { name: "年収証明書類",                   isRequired: true, note: "直近の源泉徴収票" },
        { name: "在職証明書",                     isRequired: true, note: "" },
      ];
      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書", isRequired: true, note: "" },
        { name: "高度人材ポイント計算表", isRequired: true, note: "" },
        { name: "雇用契約書（写）",       isRequired: true, note: "" },
      ];
    }

    // ── 家族滞在 ─────────────────────────────────────────────
    if (visaId === "kazoku") {
      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書",       isRequired: true,  note: "" },
        { name: "扶養者の在留カード（写）",           isRequired: true,  note: "配偶者・親の在留資格を確認" },
        { name: "婚姻・親族関係を証明する公文書",     isRequired: true,  note: "本国発行・日本語訳付き" },
        { name: "扶養者の住民税課税証明書",           isRequired: true,  note: "生計維持能力の証明" },
        { name: "扶養者の在職証明書または雇用契約書", isRequired: true,  note: "" },
      ];
      if (procId === "renew") return [
        ...common,
        { name: "扶養者の在留カード（写）", isRequired: true,  note: "" },
        { name: "扶養者の住民税課税証明書", isRequired: true,  note: "直近1年分" },
        { name: "家族関係を証明する書類",   isRequired: true,  note: "変更がある場合は最新のもの" },
      ];
      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",               isRequired: true, note: "" },
        { name: "扶養者の在留資格・在留期間を示す書類", isRequired: true, note: "" },
        { name: "婚姻・親族関係を証明する公文書",       isRequired: true, note: "" },
      ];
    }

    // ── フォールバック（未対応の組み合わせ）─────────────────
    return common;
  },

  // ── pSEOメタデータ生成（資格×手続きページ）──────────────
  generateMeta(visaId, procId) {
    const v = this.getLabel("visa", visaId);
    const p = this.getLabel("proc", procId);
    return {
      title:       `${v}の${p} 必要書類チェックリスト完全版 | All AI Toolbox`,
      description: `${v}で${p}を行う場合に必要な書類を一覧でチェック。雇用形態別に整理。入管申請前の準備に。`,
      h1:          `${v}（${p}）の必要書類リスト`,
      canonical:   `/visa-checker/${visaId}/${procId}/`,
    };
  },

  // ── pSEOメタデータ生成（地域ページ）─────────────────────
  generateAreaMeta(prefId) {
    const p = this.getLabel("pref", prefId);
    return {
      title:       `${p}の外国人雇用サポート | 登録支援機関・行政書士リスト | All AI Toolbox`,
      description: `${p}で外国人雇用・ビザ申請をサポートする登録支援機関と行政書士の一覧。`,
      h1:          `${p}の登録支援機関・行政書士`,
      canonical:   `/visa-checker/area/${prefId}/`,
    };
  },
};
