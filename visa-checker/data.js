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

  // ── STEP 2: 手続き ────────────────────────────────────────
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

  // ── 区・市区町村 ─────────────────────────────────────────
  // pSEO URL例: /visa-checker/area/tokyo/shinjuku/
  districts: [
    // 東京都
    { id: "shinjuku",    label: "新宿区",   prefId: "tokyo"   },
    { id: "chiyoda",     label: "千代田区", prefId: "tokyo"   },
    { id: "minato",      label: "港区",     prefId: "tokyo"   },
    { id: "shibuya",     label: "渋谷区",   prefId: "tokyo"   },
    { id: "toshima",     label: "豊島区",   prefId: "tokyo"   },
    { id: "taito",       label: "台東区",   prefId: "tokyo"   },
    { id: "bunkyo",      label: "文京区",   prefId: "tokyo"   },
    { id: "chuo",        label: "中央区",   prefId: "tokyo"   },
    { id: "shinagawa",   label: "品川区",   prefId: "tokyo"   },
    { id: "meguro",      label: "目黒区",   prefId: "tokyo"   },
    { id: "setagaya",    label: "世田谷区", prefId: "tokyo"   },
    { id: "suginami",    label: "杉並区",   prefId: "tokyo"   },
    { id: "nakano",      label: "中野区",   prefId: "tokyo"   },
    { id: "itabashi",    label: "板橋区",   prefId: "tokyo"   },
    { id: "nerima",      label: "練馬区",   prefId: "tokyo"   },
    { id: "kita",        label: "北区",     prefId: "tokyo"   },
    { id: "arakawa",     label: "荒川区",   prefId: "tokyo"   },
    { id: "adachi",      label: "足立区",   prefId: "tokyo"   },
    { id: "katsushika",  label: "葛飾区",   prefId: "tokyo"   },
    { id: "ota",         label: "大田区",   prefId: "tokyo"   },
    { id: "sumida",      label: "墨田区",   prefId: "tokyo"   },
    { id: "koto",        label: "江東区",   prefId: "tokyo"   },
    { id: "edogawa",     label: "江戸川区", prefId: "tokyo"   },
    // 大阪府
    { id: "osaka-chuo",  label: "中央区",   prefId: "osaka"   },
    { id: "osaka-kita",  label: "北区",     prefId: "osaka"   },
    { id: "tennoji",     label: "天王寺区", prefId: "osaka"   },
    // 愛知県
    { id: "nagoya-naka", label: "中区",     prefId: "aichi"   },
    { id: "nagoya-nakamura", label: "中村区", prefId: "aichi" },
    // 福岡県
    { id: "hakata",      label: "博多区",   prefId: "fukuoka" },
    { id: "chuo-fuk",    label: "中央区",   prefId: "fukuoka" },
  ],

  // ── 機関データ（配列形式）────────────────────────────────
  // 構造: { name, type, address, tel, visa[], prefId, districtId? }
  // ── 機関データ（初期は空。都道府県タブを開くと動的に読み込まれる）──
  // 読み込み元: /visa-checker/agencies/{prefId}.js
  // 出入国在留管理局のみ静的に定義
  agencies: [
    { name: "東京出入国在留管理局",   type: "出入国在留管理局", address: "東京都港区港南5-5-30",             tel: "0570034259", visa: ["tokutei1","gijinkoku","koudo","kazoku"], prefId: "tokyo",   districtId: "minato" },
    { name: "大阪出入国在留管理局",   type: "出入国在留管理局", address: "大阪府大阪市住之江区南港北1-29-53", tel: "0570064259", visa: ["tokutei1","gijinkoku","koudo","kazoku"], prefId: "osaka",   districtId: null },
    { name: "名古屋出入国在留管理局", type: "出入国在留管理局", address: "愛知県名古屋市港区正保町5-18",       tel: "0570034259", visa: ["tokutei1","gijinkoku","koudo","kazoku"], prefId: "aichi",   districtId: null },
    { name: "福岡出入国在留管理局",   type: "出入国在留管理局", address: "福岡県福岡市博多区博多駅東2-10-7",  tel: "0570064259", visa: ["tokutei1","gijinkoku","koudo","kazoku"], prefId: "fukuoka", districtId: "hakata" },
  ],
};


// ─────────────────────────────────────────────────────────────
//  内部ヘルパー: カテゴリーが関係しない資格か判定
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

  // ── エリア絞り込み ────────────────────────────────────────
  getAgencies({ prefId, districtId, visaId, type } = {}) {
    let list = VISA_DATA.agencies || [];
    if (prefId)     list = list.filter(a => a.prefId === prefId);
    if (districtId) list = list.filter(a => a.districtId === districtId);
    if (visaId)     list = list.filter(a => (a.visa || []).includes(visaId));
    if (type)       list = list.filter(a => a.type === type);
    return list;
  },

  // 都道府県配下の区一覧
  getDistricts(prefId) {
    return (VISA_DATA.districts || []).filter(d => d.prefId === prefId);
  },

  // ── メイン: 書類リスト取得 ──────────────────────────────
  getDocs(visaId, procId, empId, catId = "cat3") {

    const common = [
      { name: "申請書（所定様式）",         isRequired: true, note: "顔写真（4×3cm）を貼付。法務省サイトから様式を入手" },
      { name: "パスポートおよび在留カード", isRequired: true, note: "原本を提示（コピー不可）" },
    ];

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
        { name: "在留資格変更許可申請書",                 isRequired: true, note: "入管様式第22号" },
        { name: "技能測定試験合格証明書",                 isRequired: true, note: "変更後の資格に対応したもの" },
        { name: "特定技能雇用契約書（写）",               isRequired: true, note: "新しい契約書" },
        { name: "雇用条件書（写）",                       isRequired: true, note: "" },
        { name: "変更前の在留資格での活動を証明する書類", isRequired: true, note: "直近の源泉徴収票等" },
      ];
    }

    if (visaId === "gijinkoku") {
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
        return [
          ...newCommon,
          { name: "登記事項証明書（法人）",             isRequired: true,  note: "3ヶ月以内取得" },
          { name: "会社の直近の決算書（写）",           isRequired: true,  note: "2期分" },
          { name: "会社のパンフレット・事業内容説明書", isRequired: true,  note: "" },
          { name: "事業計画書",                         isRequired: true,  note: "新設の場合は必須。今後3年間の事業見通しを記載" },
          { name: "納税証明書（その3の3）",             isRequired: false, condition: "法人税・消費税の未納がないことを証明する場合" },
        ];
      }
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
        return [
          ...changeCommon,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" },
          { name: "登記事項証明書",                                         isRequired: true, note: "3ヶ月以内取得" },
          { name: "直近の決算書",                                           isRequired: true, note: "直近1期分" },
        ];
      }
    }

    if (visaId === "koudo") {
      if (procId === "new") {
        const kouBase = [
          ...common,
          { name: "在留資格認定証明書交付申請書",     isRequired: true, note: "" },
          { name: "高度人材ポイント計算表",           isRequired: true, note: "法務省所定の計算シートを使用" },
          { name: "学歴・職歴を証明する書類",         isRequired: true, note: "ポイント項目ごとに証明書を用意" },
          { name: "年収を証明する書類（雇用契約書）", isRequired: true, note: "内定通知書でも可" },
        ];
        if (catId === "cat1") return [...kouBase, { name: "在職証明書（前職）", isRequired: false, condition: "前職の実績をポイントに使う場合" }];
        if (catId === "cat2") return [...kouBase, { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" }];
        if (catId === "cat3") return [
          ...kouBase,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" },
          { name: "登記事項証明書",                                         isRequired: true, note: "3ヶ月以内取得" },
          { name: "直近の決算書",                                           isRequired: true, note: "直近1期分" },
        ];
        return [
          ...kouBase,
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" },
          { name: "登記事項証明書",                                         isRequired: true, note: "3ヶ月以内取得" },
          { name: "直近の決算書（2期分）",                                   isRequired: true, note: "" },
          { name: "事業計画書",                                             isRequired: true, note: "新設企業の場合は特に詳細に" },
        ];
      }
      if (procId === "renew") {
        const renewBase = [
          ...common,
          { name: "高度人材ポイント計算表（最新）", isRequired: true, note: "ポイントが変動している場合は再計算" },
          { name: "直近の住民税の課税・納税証明書", isRequired: true, note: "直近1年分" },
        ];
        if (catId === "cat1") return [...renewBase, { name: "在職証明書", isRequired: true, note: "カテゴリー1企業発行" }, { name: "年収証明書類", isRequired: true, note: "直近の源泉徴収票" }];
        if (catId === "cat2") return [...renewBase, { name: "年収証明書類", isRequired: true, note: "直近の源泉徴収票" }, { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）", isRequired: true, note: "" }];
        if (catId === "cat3") return [
          ...renewBase,
          { name: "年収証明書類",                                             isRequired: true, note: "直近の源泉徴収票" },
          { name: "前年分の給与所得の源泉徴収票等の法定調書合計表（控）",   isRequired: true, note: "" },
          { name: "直近の決算書",                                             isRequired: true, note: "直近1期分" },
        ];
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
        { name: "在留資格変更許可申請書", isRequired: true, note: "" },
        { name: "高度人材ポイント計算表", isRequired: true, note: "" },
        { name: "雇用契約書（写）",       isRequired: true, note: "年収を明示" },
        { name: "学歴・職歴の証明書類",   isRequired: true, note: "" },
        ...(catId === "cat3" || catId === "cat4" ? [
          { name: "登記事項証明書", isRequired: true, note: "3ヶ月以内取得" },
          { name: "直近の決算書",   isRequired: true, note: "直近1期分" },
        ] : []),
      ];
    }

    if (visaId === "kazoku") {
      if (procId === "new") return [
        ...common,
        { name: "在留資格認定証明書交付申請書",             isRequired: true,  note: "" },
        { name: "扶養者の在留カード（写）",                 isRequired: true,  note: "扶養者（配偶者・親）の在留資格を確認" },
        { name: "婚姻・親族関係を証明する公文書",           isRequired: true,  note: "本国政府発行・日本語訳付き" },
        { name: "扶養者の住民税の課税証明書",               isRequired: true,  note: "生計維持能力を証明" },
        { name: "扶養者の在職証明書または雇用契約書（写）", isRequired: true,  note: "" },
        { name: "扶養者の給与明細（直近3ヶ月）",           isRequired: false, condition: "課税証明書だけでは収入が確認しづらい場合" },
        { name: "日本での住居を証明する書類",               isRequired: false, condition: "すでに日本に住居がある場合（賃貸契約書等）" },
      ];
      if (procId === "renew") return [
        ...common,
        { name: "扶養者の在留カード（写）",       isRequired: true,  note: "在留期限・資格を確認" },
        { name: "扶養者の住民税の課税証明書",     isRequired: true,  note: "直近1年分" },
        { name: "家族関係を証明する書類",         isRequired: true,  note: "変更・更新がある場合は最新版を提出" },
        { name: "扶養者の在職証明書（写）",       isRequired: false, condition: "扶養者が転職・雇用状況変更した場合" },
        { name: "婚姻・親族関係を証明する公文書", isRequired: false, condition: "家族関係に変更（出産・入籍等）があった場合" },
      ];
      if (procId === "change") return [
        ...common,
        { name: "在留資格変更許可申請書",               isRequired: true, note: "" },
        { name: "扶養者の在留資格・在留期間を示す書類", isRequired: true, note: "" },
        { name: "婚姻・親族関係を証明する公文書",       isRequired: true, note: "本国発行・日本語訳付き" },
        { name: "扶養者の生計維持能力を示す書類",       isRequired: true, note: "課税証明書・給与明細等" },
      ];
    }

    return common;
  },

  // ── pSEOメタデータ（資格×手続き）────────────────────────
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

  // ── pSEOメタデータ（地域）────────────────────────────────
  generateAreaMeta(prefId) {
    const p = this.getLabel("pref", prefId);
    return {
      title:       `${p}の外国人雇用サポート | 登録支援機関・行政書士リスト | All AI Toolbox`,
      description: `${p}で外国人雇用・ビザ申請をサポートする登録支援機関と行政書士の一覧。在留資格別に対応機関を検索できます。`,
      h1:          `${p}の登録支援機関・行政書士`,
      canonical:   `/visa-checker/area/${prefId}/`,
    };
  },

  // ── pSEOメタデータ（区レベル）───────────────────────────
  generateDistrictMeta(prefId, districtId) {
    const pref     = VISA_DATA.prefectures?.find(p => p.id === prefId);
    const district = VISA_DATA.districts?.find(d => d.id === districtId);
    const pl = pref?.label     || prefId;
    const dl = district?.label || districtId;
    return {
      title:       `${pl}${dl}の外国人雇用サポート | 登録支援機関・行政書士 | All AI Toolbox`,
      description: `${pl}${dl}で外国人雇用・ビザ申請をサポートする登録支援機関と行政書士の一覧。`,
      h1:          `${pl}${dl}の登録支援機関・行政書士`,
      canonical:   `/visa-checker/area/${prefId}/${districtId}/`,
    };
  },
};
