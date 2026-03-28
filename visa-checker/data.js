/**
 * 外国人ビザ書類チェッカー — データベース v3
 * ─────────────────────────────────────────────
 * getDocs(visaId, procId, empId, catId) で書類を取得
 * catId: "cat1"〜"cat4"（省略時は "cat3"）
 */

const VISA_DATA = {

  // ── STEP 1: 在留資格 ──────────────────────────────────────
  visas: [
    { id: "tokutei1",  label: "特定技能1号",            slug: "tokutei1",  color: "#2563eb" },
    { id: "gijinkoku", label: "技術・人文知識・国際業務", slug: "gijinkoku", color: "#1d4ed8" },
    { id: "koudo",     label: "高度専門職",              slug: "hsp",       color: "#1e40af" },
    { id: "kazoku",    label: "家族滞在",                slug: "dependent", color: "#3b82f6" },
  ],

  // ── STEP 2: 手続き ──────────────────────────────────────
  procedures: [
    { id: "renew",  label: "更新（期間延長）"         },
    { id: "change", label: "変更（別のビザから）"     },
    { id: "new",    label: "新規（海外から呼び寄せ）" },
  ],

  // ── STEP 3: 雇用形態 ──────────────────────────────────────
  empTypes: [
    { id: "direct",   label: "直接雇用（正社員・契約）" },
    { id: "dispatch", label: "労働者派遣"               },
  ],

  // ── STEP 4: 会社カテゴリー ────────────────────────────────
  categories: [
    { id: "cat1", label: "カテゴリー1", desc: "上場企業・公的機関",     color: "#059669" },
    { id: "cat2", label: "カテゴリー2", desc: "中堅企業（源泉票あり）",  color: "#2563eb" },
    { id: "cat3", label: "カテゴリー3", desc: "中小企業・一般企業",      color: "#d97706" },
    { id: "cat4", label: "カテゴリー4", desc: "新設・赤字・個人事業主",  color: "#dc2626" },
  ],

  // ── 都道府県 ──────────────────────────────────────────────
  prefectures: [
    { id: "tokyo",   label: "東京都",  office: "東京出入国在留管理局"   },
    { id: "osaka",   label: "大阪府",  office: "大阪出入国在留管理局"   },
    { id: "aichi",   label: "愛知県",  office: "名古屋出入国在留管理局" },
    { id: "fukuoka", label: "福岡県",  office: "福岡出入国在留管理局"   },
  ],

  // ── 地域別相談先 ──────────────────────────────────────────
  // 構造: { name, type, address, tel, visa[] }
  agencies: {
    tokyo: [
      {
        name: "東京出入国在留管理局",
        type: "出入国在留管理局",
        address: "東京都港区港南5-5-30",
        tel: "0570-034259",
        visa: ["tokutei1","gijinkoku","koudo","kazoku"],
      },
      {
        name: "新宿行政書士事務所（サンプル）",
        type: "行政書士",
        address: "東京都新宿区",
        tel: "03-XXXX-XXXX",
        visa: ["tokutei1","gijinkoku"],
      },
    ],
    osaka: [
      {
        name: "大阪出入国在留管理局",
        type: "出入国在留管理局",
        address: "大阪府大阪市住之江区南港北1-29-53",
        tel: "0570-064259",
        visa: ["tokutei1","gijinkoku","koudo","kazoku"],
      },
    ],
    aichi: [
      {
        name: "名古屋出入国在留管理局",
        type: "出入国在留管理局",
        address: "愛知県名古屋市港区正保町5-18",
        tel: "0570-034259",
        visa: ["tokutei1","gijinkoku","koudo","kazoku"],
      },
    ],
    fukuoka: [
      {
        name: "福岡出入国在留管理局",
        type: "出入国在留管理局",
        address: "福岡県福岡市博多区博多駅東2-10-7",
        tel: "0570-064259",
        visa: ["tokutei1","gijinkoku","koudo","kazoku"],
      },
    ],
  },
};


// ─────────────────────────────────────────────────────────────
//  内部ヘルパー: カテゴリーが関係しない資格か判定
//  特定技能・家族滞在はカテゴリー概念がない（会社規模で書類が変わらない）
// ─────────────────────────────────────────────────────────────
function _isCatRelevant(visaId) {
  return ["gijinkoku", "koudo"].includes(visaId);
}


const VISA_LOGIC = {

  getLabel(type, id) {
    const maps = {
      visa: VISA_DATA.visas,
      proc: VISA_DATA.procedures,
      emp:  VISA_DATA.empTypes,
      pref: VISA_DATA.prefectures,
      cat:  VISA_DATA.categories,
    };
    return maps[type]?.find(x => x.id === id)?.label || id;
  },

  getCategoryLabel(id) {
    return VISA_DATA.categories?.find(c => c.id === id)?.label || id;
  },

  // ── メイン: 書類リスト取得 ──────────────────────────────
  getDocs(visaId, procId, empId, catId = "cat3") {

    // 全資格・全手続き共通書類
    const common = [
      { name: "申請書（所定様式）",         isRequired: true, note: "顔写真（4×3cm）を貼付。法務省サイトから様式を入手" },
      { name: "パスポートおよび在留カード", isRequired: true, note: "原本を提示（コピー不可）" },
    ];

    // ════════════════════════════════════════════════════════
    //  特定技能1号
    //  カテゴリー概念なし（所属機関の種別で一部変動はあるが
    //  企業規模ではなく登録支援機関の有無で分岐）
    // ════════════════════════════════════════════════════════
    if (visaId === "tokutei1") {

      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書",     isRequired: true,  note: "入管様式第6号" },
        { name: "特定技能雇用契約書（写）",         isRequired: true,  note: "報酬額・労働条件を明記" },
        { name: "雇用条件書（写）",                 isRequired: true,  note: "日本語＋母国語で作成" },
        { name: "技能測定試験合格証明書",           isRequired: true,  note: "特定産業分野の試験" },
        { name: "日本語能力試験 合格証書",          isRequired: true,  note: "N4以上またはA2以上" },
        { name: "健康診断個人票",                   isRequired: true,  note: "指定様式による" },
        { name: "事前ガイダンス確認書",             isRequired: true,  note: "" },
        { name: "特定技能所属機関の決算書（写）",   isRequired: true,  note: "直近1年分" },
        { name: "納税義務の履行を証明する文書",     isRequired: true,  note: "住民税課税証明書・納税証明書" },
        { name: "登録支援機関との委託契約書（写）", isRequired: false, condition: "登録支援機関に委託する場合のみ" },
      ];

      if (procId === "renew") return [
        ...common,
        { name: "特定技能外国人の報酬に関する説明書",     isRequired: true,  note: "日本人と同等額以上であることを示す" },
        { name: "健康診断個人票",                         isRequired: true,  note: "受診から1年以内のもの" },
        { name: "給与所得の源泉徴収票（写）",             isRequired: true,  note: "前年分" },
        { name: "住民税の課税・納税証明書",               isRequired: true,  note: "直近1年分" },
        { name: "支援計画履行状況届出書（直近分の写）",   isRequired: true,  note: "四半期ごとの定期届出のもの" },
        { name: "社会保険料納付証明書",                   isRequired: false, condition: "社会保険適用事業所であることを証明する場合" },
        { name: "登録支援機関との委託契約継続を示す書類", isRequired: false, condition: "委託を継続する場合のみ" },
      ];

      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",               isRequired: true, note: "入管様式第22号" },
        { name: "技能測定試験合格証明書",               isRequired: true, note: "変更後の資格に対応したもの" },
        { name: "特定技能雇用契約書（写）",             isRequired: true, note: "新しい契約書" },
        { name: "雇用条件書（写）",                     isRequired: true, note: "" },
        { name: "変更前の在留資格での活動を証明する書類", isRequired: true, note: "直近の源泉徴収票等" },
      ];
    }

    // ════════════════════════════════════════════════════════
    //  技術・人文知識・国際業務（カテゴリー分岐あり）
    // ════════════════════════════════════════════════════════
    if (visaId === "gijinkoku") {

      // ── 新規（カテゴリー分岐あり） ──────────────────────
      if (procId === "new") {
        const newCommon = [
          ...common,
          { name: "在留資格認定証明書交付申請書", isRequired: true, note: "" },
          { name: "大学・専門学校の卒業証明書",   isRequired: true, note: "学歴要件を満たすもの" },
          { name: "成績証明書",                   isRequired: true, note: "専攻と職務の関連性を示す" },
          { name: "採用理由書",                   isRequired: true, note: "日本語で職務内容と専攻の関連を詳述" },
          { name: "雇用契約書（写）",             isRequired: true, note: "労働条件・報酬額を明記" },
        ];
        if (catId === "cat1") return [
          ...newCommon,
          { name: "四季報・日経会社情報等の写し", isRequired: false, condition: "上場企業であることを示す場合（他書類を多数省略可）" },
        ];
        if (catId === "cat2") return [
          ...newCommon,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "税務署受付印があるもの" },
        ];
        if (catId === "cat3") return [
          ...newCommon,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true,  note: "税務署受付印があるもの" },
          { name: "登記事項証明書（法人）",                               isRequired: true,  note: "3ヶ月以内取得" },
          { name: "会社の直近の決算書（写）",                             isRequired: true,  note: "直近1〜2期分" },
          { name: "会社のパンフレット・事業内容説明書",                   isRequired: true,  note: "" },
        ];
        // cat4
        return [
          ...newCommon,
          { name: "登記事項証明書（法人）",             isRequired: true,  note: "3ヶ月以内取得" },
          { name: "会社の直近の決算書（写）",           isRequired: true,  note: "2期分" },
          { name: "会社のパンフレット・事業内容説明書", isRequired: true,  note: "" },
          { name: "事業計画書",                         isRequired: true,  note: "新設の場合は必須。今後3年間の事業見通しを記載" },
          { name: "納税証明書（その3の3）",             isRequired: false, condition: "法人税・消費税の未納がないことを証明する場合" },
        ];
      }

      // ── 更新（カテゴリー分岐あり） ──────────────────────
      if (procId === "renew") {
        if (catId === "cat1") return [
          ...common,
          { name: "在職証明書",                     isRequired: true,  note: "カテゴリー1企業発行。これ1枚で多くの書類を省略可能" },
          { name: "直近の住民税の課税・納税証明書", isRequired: true,  note: "直近1年分" },
          { name: "雇用契約書の写し",               isRequired: false, condition: "契約内容（給与・役職）に変更がある場合のみ" },
        ];
        if (catId === "cat2") return [
          ...common,
          { name: "直近の住民税の課税・納税証明書",                         isRequired: true,  note: "直近1年分" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true,  note: "税務署受付印があるもの" },
          { name: "雇用契約書の写し",                                         isRequired: false, condition: "契約内容に変更がある場合" },
        ];
        if (catId === "cat3") return [
          ...common,
          { name: "直近の住民税の課税・納税証明書",                         isRequired: true, note: "直近1年分。コンビニ取得可" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true, note: "税務署受付印または電子申告受付番号が必要" },
          { name: "直近の決算書",                                             isRequired: true, note: "損益計算書・貸借対照表を含む直近1期分" },
          { name: "雇用契約書の写し",                                         isRequired: false, condition: "契約内容（給与・役職・業務内容）に変更がある場合" },
        ];
        // cat4
        return [
          ...common,
          { name: "直近の住民税の課税・納税証明書",                         isRequired: true,  note: "直近1年分" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true,  note: "税務署受付印があるもの" },
          { name: "直近の決算書（2期分）",                                   isRequired: true,  note: "赤字の場合は説明資料も添付" },
          { name: "登記事項証明書",                                           isRequired: true,  note: "3ヶ月以内取得" },
          { name: "雇用契約書の写し",                                         isRequired: true,  note: "給与・業務内容を明記したもの" },
          { name: "事業計画書または収支説明書",                               isRequired: false, condition: "赤字・新設等で財務状況の説明が必要な場合" },
          { name: "納税証明書（その3の3）",                                   isRequired: false, condition: "法人税・消費税の未納がないことを証明する場合" },
        ];
      }

      // ── 変更（カテゴリー参考程度、共通書類多め） ────────
      if (procId === "change") {
        const changeCommon = [
          ...common,
          { name: "在留資格変更許可申請書",                   isRequired: true, note: "入管様式第22号" },
          { name: "採用理由書",                               isRequired: true, note: "変更後の職務と専攻の関連を詳述" },
          { name: "雇用契約書（写）",                         isRequired: true, note: "新しい職場の契約書" },
          { name: "学歴・職歴を証する書類",                   isRequired: true, note: "" },
          { name: "変更前の在留資格の活動内容を証明する書類", isRequired: true, note: "直近の源泉徴収票等" },
        ];
        if (catId === "cat1") return changeCommon;
        if (catId === "cat2") return [
          ...changeCommon,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" },
        ];
        // cat3・cat4
        return [
          ...changeCommon,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" },
          { name: "登記事項証明書",                                         isRequired: true, note: "3ヶ月以内取得" },
          { name: "直近の決算書",                                           isRequired: true, note: "直近1期分" },
        ];
      }
    }

    // ════════════════════════════════════════════════════════
    //  高度専門職（カテゴリー分岐あり）
    //  ポイント計算と年収証明が核。カテゴリーにより補強書類が変わる
    // ════════════════════════════════════════════════════════
    if (visaId === "koudo") {

      if (procId === "new") {
        const kouBase = [
          ...common,
          { name: "在留資格認定証明書交付申請書",   isRequired: true, note: "" },
          { name: "高度人材ポイント計算表",         isRequired: true, note: "法務省所定の計算シートを使用" },
          { name: "学歴・職歴を証明する書類",       isRequired: true, note: "ポイント項目ごとに証明書を用意" },
          { name: "年収を証明する書類（雇用契約書）", isRequired: true, note: "内定通知書でも可" },
        ];
        if (catId === "cat1") return [
          ...kouBase,
          { name: "在職証明書（前職）",             isRequired: false, condition: "前職の実績をポイントに使う場合" },
        ];
        if (catId === "cat2") return [
          ...kouBase,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" },
        ];
        if (catId === "cat3") return [
          ...kouBase,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true,  note: "" },
          { name: "登記事項証明書",                                         isRequired: true,  note: "3ヶ月以内取得" },
          { name: "直近の決算書",                                           isRequired: true,  note: "直近1期分" },
        ];
        // cat4
        return [
          ...kouBase,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true,  note: "" },
          { name: "登記事項証明書",                                         isRequired: true,  note: "3ヶ月以内取得" },
          { name: "直近の決算書（2期分）",                                   isRequired: true,  note: "" },
          { name: "事業計画書",                                             isRequired: true,  note: "新設企業の場合は特に詳細に" },
        ];
      }

      if (procId === "renew") {
        const renewBase = [
          ...common,
          { name: "高度人材ポイント計算表（最新）",   isRequired: true, note: "ポイントが変動している場合は再計算" },
          { name: "直近の住民税の課税・納税証明書",   isRequired: true, note: "直近1年分" },
        ];
        if (catId === "cat1") return [
          ...renewBase,
          { name: "在職証明書",     isRequired: true, note: "カテゴリー1企業発行" },
          { name: "年収証明書類",   isRequired: true, note: "直近の源泉徴収票" },
        ];
        if (catId === "cat2") return [
          ...renewBase,
          { name: "年収証明書類",                                             isRequired: true, note: "直近の源泉徴収票" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true, note: "" },
        ];
        if (catId === "cat3") return [
          ...renewBase,
          { name: "年収証明書類",                                             isRequired: true,  note: "直近の源泉徴収票" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true,  note: "" },
          { name: "直近の決算書",                                             isRequired: true,  note: "直近1期分" },
        ];
        // cat4
        return [
          ...renewBase,
          { name: "年収証明書類",                                             isRequired: true,  note: "直近の源泉徴収票" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true,  note: "" },
          { name: "直近の決算書（2期分）",                                   isRequired: true,  note: "" },
          { name: "登記事項証明書",                                           isRequired: true,  note: "3ヶ月以内取得" },
          { name: "事業計画書または収支説明書",                               isRequired: false, condition: "財務状況に懸念がある場合" },
        ];
      }

      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",   isRequired: true, note: "" },
        { name: "高度人材ポイント計算表",   isRequired: true, note: "" },
        { name: "雇用契約書（写）",         isRequired: true, note: "年収を明示" },
        { name: "学歴・職歴の証明書類",     isRequired: true, note: "" },
        ...(catId === "cat3" || catId === "cat4" ? [
          { name: "登記事項証明書",   isRequired: true, note: "3ヶ月以内取得" },
          { name: "直近の決算書",     isRequired: true, note: "直近1期分" },
        ] : []),
      ];
    }

    // ════════════════════════════════════════════════════════
    //  家族滞在
    //  カテゴリー概念なし（扶養者の状況で変動はあるが会社規模は関係しない）
    //  ただし扶養者の在留資格の種類で書類が変わるため、その旨をnoteで案内
    // ════════════════════════════════════════════════════════
    if (visaId === "kazoku") {

      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書",           isRequired: true,  note: "" },
        { name: "扶養者の在留カード（写）",               isRequired: true,  note: "扶養者（配偶者・親）の在留資格を確認" },
        { name: "婚姻・親族関係を証明する公文書",         isRequired: true,  note: "本国政府発行・日本語訳付き" },
        { name: "扶養者の住民税の課税証明書",             isRequired: true,  note: "生計維持能力を証明" },
        { name: "扶養者の在職証明書または雇用契約書（写）", isRequired: true, note: "" },
        { name: "扶養者の給与明細（直近3ヶ月）",         isRequired: false, condition: "課税証明書だけでは収入が確認しづらい場合" },
        { name: "日本での住居を証明する書類",             isRequired: false, condition: "すでに日本に住居がある場合（賃貸契約書等）" },
      ];

      if (procId === "renew") return [
        ...common,
        { name: "扶養者の在留カード（写）",         isRequired: true, note: "在留期限・資格を確認" },
        { name: "扶養者の住民税の課税証明書",       isRequired: true, note: "直近1年分" },
        { name: "家族関係を証明する書類",           isRequired: true, note: "変更・更新がある場合は最新版を提出" },
        { name: "扶養者の在職証明書（写）",         isRequired: false, condition: "扶養者が転職・雇用状況変更した場合" },
        { name: "婚姻・親族関係を証明する公文書",   isRequired: false, condition: "家族関係に変更（出産・入籍等）があった場合" },
      ];

      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",                   isRequired: true, note: "" },
        { name: "扶養者の在留資格・在留期間を示す書類",     isRequired: true, note: "" },
        { name: "婚姻・親族関係を証明する公文書",           isRequired: true, note: "本国発行・日本語訳付き" },
        { name: "扶養者の生計維持能力を示す書類",           isRequired: true, note: "課税証明書・給与明細等" },
      ];
    }

    // フォールバック
    return common;
  },

  // ── pSEOメタデータ（資格×手続き）──────────────────────
  generateMeta(visaId, procId) {
    const v = this.getLabel("visa", visaId);
    const p = this.getLabel("proc", procId);
    return {
      title:       `${v}の${p} 必要書類チェックリスト完全版 | All AI Toolbox`,
      description: `${v}で${p}を行う場合に必要な書類を一覧でチェック。カテゴリー別・雇用形態別に整理。入管申請前の準備に。`,
      h1:          `${v}（${p}）の必要書類リスト`,
      canonical:   `/visa-checker/${visaId}/${procId}/`,
    };
  },

  // ── pSEOメタデータ（地域）──────────────────────────────
  generateAreaMeta(prefId) {
    const p = this.getLabel("pref", prefId);
    return {
      title:       `${p}の外国人雇用サポート | 登録支援機関・行政書士リスト | All AI Toolbox`,
      description: `${p}で外国人雇用・ビザ申請をサポートする登録支援機関と行政書士の一覧。在留資格別に対応機関を検索できます。`,
      h1:          `${p}の登録支援機関・行政書士`,
      canonical:   `/visa-checker/area/${prefId}/`,
    };
  },
};
