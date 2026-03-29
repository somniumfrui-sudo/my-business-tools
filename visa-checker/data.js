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
    { id: "hokkaido-1", label: "札幌市", prefId: "hokkaido" },
    { id: "hokkaido-2", label: "帯広市", prefId: "hokkaido" },
    { id: "hokkaido-3", label: "紋別市", prefId: "hokkaido" },
    { id: "hokkaido-4", label: "千歳市", prefId: "hokkaido" },
    { id: "hokkaido-5", label: "河東郡音更町", prefId: "hokkaido" },
    { id: "hokkaido-6", label: "釧路市", prefId: "hokkaido" },
    { id: "hokkaido-7", label: "勇払郡むかわ町", prefId: "hokkaido" },
    { id: "hokkaido-8", label: "野付郡別海町", prefId: "hokkaido" },
    { id: "hokkaido-9", label: "稚内市", prefId: "hokkaido" },
    { id: "hokkaido-10", label: "滝川市", prefId: "hokkaido" },
    { id: "hokkaido-11", label: "茅部郡森町", prefId: "hokkaido" },
    { id: "hokkaido-12", label: "沙流郡平取町", prefId: "hokkaido" },
    { id: "hokkaido-13", label: "北斗市", prefId: "hokkaido" },
    { id: "hokkaido-14", label: "宗谷郡猿払村", prefId: "hokkaido" },
    { id: "hokkaido-15", label: "根室市", prefId: "hokkaido" },
    { id: "hokkaido-16", label: "広尾郡大樹町", prefId: "hokkaido" },
    { id: "hokkaido-17", label: "江別市", prefId: "hokkaido" },
    { id: "hokkaido-18", label: "旭川市", prefId: "hokkaido" },
    { id: "hokkaido-19", label: "新冠郡新冠町", prefId: "hokkaido" },
    { id: "hokkaido-20", label: "山越郡長万部町", prefId: "hokkaido" },
    { id: "aomori-1", label: "八戸市", prefId: "aomori" },
    { id: "aomori-2", label: "つがる市", prefId: "aomori" },
    { id: "aomori-3", label: "青森市", prefId: "aomori" },
    { id: "aomori-4", label: "弘前市", prefId: "aomori" },
    { id: "aomori-5", label: "五所川原市", prefId: "aomori" },
    { id: "aomori-6", label: "上北郡野辺地町", prefId: "aomori" },
    { id: "iwate-1", label: "盛岡市", prefId: "iwate" },
    { id: "iwate-2", label: "大船渡市", prefId: "iwate" },
    { id: "iwate-3", label: "遠野市", prefId: "iwate" },
    { id: "iwate-4", label: "胆沢郡金ケ崎町", prefId: "iwate" },
    { id: "iwate-5", label: "奥州市", prefId: "iwate" },
    { id: "iwate-6", label: "一関市", prefId: "iwate" },
    { id: "iwate-7", label: "宮古市", prefId: "iwate" },
    { id: "iwate-8", label: "釜石市", prefId: "iwate" },
    { id: "miyagi-1", label: "仙台市", prefId: "miyagi" },
    { id: "miyagi-2", label: "石巻市", prefId: "miyagi" },
    { id: "miyagi-3", label: "塩竈市", prefId: "miyagi" },
    { id: "miyagi-4", label: "黒川郡大郷町", prefId: "miyagi" },
    { id: "miyagi-5", label: "宮城郡七ヶ浜町", prefId: "miyagi" },
    { id: "miyagi-6", label: "黒川郡大和町", prefId: "miyagi" },
    { id: "miyagi-7", label: "塩竃市", prefId: "miyagi" },
    { id: "miyagi-8", label: "気仙沼市", prefId: "miyagi" },
    { id: "miyagi-9", label: "白石市", prefId: "miyagi" },
    { id: "miyagi-10", label: "多賀城市", prefId: "miyagi" },
    { id: "akita-1", label: "秋田市", prefId: "akita" },
    { id: "akita-2", label: "湯沢市", prefId: "akita" },
    { id: "yamagata-1", label: "米沢市", prefId: "yamagata" },
    { id: "yamagata-2", label: "東根市", prefId: "yamagata" },
    { id: "yamagata-3", label: "山形市", prefId: "yamagata" },
    { id: "yamagata-4", label: "上山市", prefId: "yamagata" },
    { id: "yamagata-5", label: "天童市", prefId: "yamagata" },
    { id: "fukushima-1", label: "いわき市", prefId: "fukushima" },
    { id: "fukushima-2", label: "福島市", prefId: "fukushima" },
    { id: "fukushima-3", label: "郡山市", prefId: "fukushima" },
    { id: "fukushima-4", label: "須賀川市", prefId: "fukushima" },
    { id: "fukushima-5", label: "岩瀬郡鏡石町", prefId: "fukushima" },
    { id: "fukushima-6", label: "双葉郡浪江町", prefId: "fukushima" },
    { id: "ibaraki-1", label: "鉾田市", prefId: "ibaraki" },
    { id: "ibaraki-2", label: "土浦市", prefId: "ibaraki" },
    { id: "ibaraki-3", label: "行方市", prefId: "ibaraki" },
    { id: "ibaraki-4", label: "つくば市", prefId: "ibaraki" },
    { id: "ibaraki-5", label: "水戸市", prefId: "ibaraki" },
    { id: "ibaraki-6", label: "東茨城郡大洗町", prefId: "ibaraki" },
    { id: "ibaraki-7", label: "古河市", prefId: "ibaraki" },
    { id: "ibaraki-8", label: "ひたちなか市", prefId: "ibaraki" },
    { id: "ibaraki-9", label: "龍ケ崎市", prefId: "ibaraki" },
    { id: "ibaraki-10", label: "牛久市", prefId: "ibaraki" },
    { id: "ibaraki-11", label: "日立市", prefId: "ibaraki" },
    { id: "ibaraki-12", label: "神栖市", prefId: "ibaraki" },
    { id: "ibaraki-13", label: "取手市", prefId: "ibaraki" },
    { id: "ibaraki-14", label: "下妻市", prefId: "ibaraki" },
    { id: "ibaraki-15", label: "守谷市", prefId: "ibaraki" },
    { id: "ibaraki-16", label: "東茨城郡茨城町", prefId: "ibaraki" },
    { id: "ibaraki-17", label: "結城郡八千代町", prefId: "ibaraki" },
    { id: "ibaraki-18", label: "猿島郡境町", prefId: "ibaraki" },
    { id: "ibaraki-19", label: "常総市", prefId: "ibaraki" },
    { id: "ibaraki-20", label: "つくばみらい市", prefId: "ibaraki" },
    { id: "tochigi-1", label: "宇都宮市", prefId: "tochigi" },
    { id: "tochigi-2", label: "小山市", prefId: "tochigi" },
    { id: "tochigi-3", label: "栃木市", prefId: "tochigi" },
    { id: "tochigi-4", label: "大田原市", prefId: "tochigi" },
    { id: "tochigi-5", label: "足利市", prefId: "tochigi" },
    { id: "tochigi-6", label: "鹿沼市", prefId: "tochigi" },
    { id: "tochigi-7", label: "芳賀郡茂木町", prefId: "tochigi" },
    { id: "tochigi-8", label: "那須塩原市", prefId: "tochigi" },
    { id: "tochigi-9", label: "佐野市", prefId: "tochigi" },
    { id: "tochigi-10", label: "塩谷郡高根沢町", prefId: "tochigi" },
    { id: "gunma-1", label: "前橋市", prefId: "gunma" },
    { id: "gunma-2", label: "太田市", prefId: "gunma" },
    { id: "gunma-3", label: "伊勢崎市", prefId: "gunma" },
    { id: "gunma-4", label: "高崎市", prefId: "gunma" },
    { id: "gunma-5", label: "館林市", prefId: "gunma" },
    { id: "gunma-6", label: "桐生市", prefId: "gunma" },
    { id: "gunma-7", label: "安中市", prefId: "gunma" },
    { id: "gunma-8", label: "北群馬郡榛東村", prefId: "gunma" },
    { id: "gunma-9", label: "邑楽郡板倉町", prefId: "gunma" },
    { id: "gunma-10", label: "利根郡昭和村", prefId: "gunma" },
    { id: "gunma-11", label: "沼田市", prefId: "gunma" },
    { id: "saitama-1", label: "さいたま市", prefId: "saitama" },
    { id: "saitama-2", label: "川越市", prefId: "saitama" },
    { id: "saitama-3", label: "川口市", prefId: "saitama" },
    { id: "saitama-4", label: "深谷市", prefId: "saitama" },
    { id: "saitama-5", label: "所沢市", prefId: "saitama" },
    { id: "saitama-6", label: "越谷市", prefId: "saitama" },
    { id: "saitama-7", label: "朝霞市", prefId: "saitama" },
    { id: "saitama-8", label: "本庄市", prefId: "saitama" },
    { id: "saitama-9", label: "東松山市", prefId: "saitama" },
    { id: "saitama-10", label: "春日部市", prefId: "saitama" },
    { id: "saitama-11", label: "行田市", prefId: "saitama" },
    { id: "saitama-12", label: "熊谷市", prefId: "saitama" },
    { id: "saitama-13", label: "白岡市", prefId: "saitama" },
    { id: "saitama-14", label: "羽生市", prefId: "saitama" },
    { id: "saitama-15", label: "児玉郡上里町", prefId: "saitama" },
    { id: "saitama-16", label: "入間市", prefId: "saitama" },
    { id: "saitama-17", label: "富士見市", prefId: "saitama" },
    { id: "saitama-18", label: "北本市", prefId: "saitama" },
    { id: "saitama-19", label: "志木市", prefId: "saitama" },
    { id: "saitama-20", label: "草加市", prefId: "saitama" },
    { id: "chiba-1", label: "千葉市", prefId: "chiba" },
    { id: "chiba-2", label: "船橋市", prefId: "chiba" },
    { id: "chiba-3", label: "成田市", prefId: "chiba" },
    { id: "chiba-4", label: "市川市", prefId: "chiba" },
    { id: "chiba-5", label: "銚子市", prefId: "chiba" },
    { id: "chiba-6", label: "印西市", prefId: "chiba" },
    { id: "chiba-7", label: "佐倉市", prefId: "chiba" },
    { id: "chiba-8", label: "八街市", prefId: "chiba" },
    { id: "chiba-9", label: "市原市", prefId: "chiba" },
    { id: "chiba-10", label: "我孫子市", prefId: "chiba" },
    { id: "chiba-11", label: "木更津市", prefId: "chiba" },
    { id: "chiba-12", label: "白井市", prefId: "chiba" },
    { id: "chiba-13", label: "茂原市", prefId: "chiba" },
    { id: "chiba-14", label: "鴨川市", prefId: "chiba" },
    { id: "chiba-15", label: "松戸市", prefId: "chiba" },
    { id: "chiba-16", label: "浦安市", prefId: "chiba" },
    { id: "chiba-17", label: "八千代市", prefId: "chiba" },
    { id: "chiba-18", label: "富津市", prefId: "chiba" },
    { id: "chiba-19", label: "富里市", prefId: "chiba" },
    { id: "chiba-20", label: "長生郡白子町", prefId: "chiba" },
    { id: "tokyo-1", label: "新宿区", prefId: "tokyo" },
    { id: "tokyo-2", label: "千代田区", prefId: "tokyo" },
    { id: "tokyo-3", label: "中央区", prefId: "tokyo" },
    { id: "tokyo-4", label: "台東区", prefId: "tokyo" },
    { id: "tokyo-5", label: "渋谷区", prefId: "tokyo" },
    { id: "tokyo-6", label: "豊島区", prefId: "tokyo" },
    { id: "tokyo-7", label: "品川区", prefId: "tokyo" },
    { id: "tokyo-8", label: "江戸川区", prefId: "tokyo" },
    { id: "tokyo-9", label: "文京区", prefId: "tokyo" },
    { id: "tokyo-10", label: "墨田区", prefId: "tokyo" },
    { id: "tokyo-11", label: "江東区", prefId: "tokyo" },
    { id: "tokyo-12", label: "荒川区", prefId: "tokyo" },
    { id: "tokyo-13", label: "葛飾区", prefId: "tokyo" },
    { id: "tokyo-14", label: "板橋区", prefId: "tokyo" },
    { id: "tokyo-15", label: "大田区", prefId: "tokyo" },
    { id: "tokyo-16", label: "足立区", prefId: "tokyo" },
    { id: "tokyo-17", label: "目黒区", prefId: "tokyo" },
    { id: "tokyo-18", label: "調布市", prefId: "tokyo" },
    { id: "tokyo-19", label: "港区浜松町", prefId: "tokyo" },
    { id: "tokyo-20", label: "八王子市", prefId: "tokyo" },
    { id: "kanagawa-1", label: "県横浜市", prefId: "kanagawa" },
    { id: "kanagawa-2", label: "県相模原市", prefId: "kanagawa" },
    { id: "kanagawa-3", label: "県川崎市", prefId: "kanagawa" },
    { id: "kanagawa-4", label: "県平塚市", prefId: "kanagawa" },
    { id: "kanagawa-5", label: "県大和市", prefId: "kanagawa" },
    { id: "kanagawa-6", label: "県横須賀市", prefId: "kanagawa" },
    { id: "kanagawa-7", label: "県小田原市", prefId: "kanagawa" },
    { id: "kanagawa-8", label: "県茅ヶ崎市", prefId: "kanagawa" },
    { id: "kanagawa-9", label: "県藤沢市", prefId: "kanagawa" },
    { id: "kanagawa-10", label: "県三浦市", prefId: "kanagawa" },
    { id: "kanagawa-11", label: "県秦野市", prefId: "kanagawa" },
    { id: "kanagawa-12", label: "県伊勢原市", prefId: "kanagawa" },
    { id: "niigata-1", label: "新潟市", prefId: "niigata" },
    { id: "niigata-2", label: "北蒲原郡聖籠町", prefId: "niigata" },
    { id: "niigata-3", label: "長岡市", prefId: "niigata" },
    { id: "niigata-4", label: "上越市", prefId: "niigata" },
    { id: "niigata-5", label: "中央区", prefId: "niigata" },
    { id: "toyama-1", label: "富山市", prefId: "toyama" },
    { id: "toyama-2", label: "高岡市", prefId: "toyama" },
    { id: "toyama-3", label: "砺波市", prefId: "toyama" },
    { id: "toyama-4", label: "黒部市", prefId: "toyama" },
    { id: "toyama-5", label: "滑川市", prefId: "toyama" },
    { id: "toyama-6", label: "魚津市", prefId: "toyama" },
    { id: "ishikawa-1", label: "金沢市", prefId: "ishikawa" },
    { id: "ishikawa-2", label: "野々市", prefId: "ishikawa" },
    { id: "ishikawa-3", label: "河北郡津幡町", prefId: "ishikawa" },
    { id: "ishikawa-4", label: "能美市", prefId: "ishikawa" },
    { id: "fukui-1", label: "福井市", prefId: "fukui" },
    { id: "fukui-2", label: "越前市", prefId: "fukui" },
    { id: "fukui-3", label: "坂井市", prefId: "fukui" },
    { id: "fukui-4", label: "鯖江市", prefId: "fukui" },
    { id: "fukui-5", label: "あわら市", prefId: "fukui" },
    { id: "yamanashi-1", label: "中巨摩郡昭和町", prefId: "yamanashi" },
    { id: "yamanashi-2", label: "甲府市", prefId: "yamanashi" },
    { id: "yamanashi-3", label: "富士吉田市", prefId: "yamanashi" },
    { id: "yamanashi-4", label: "甲州市", prefId: "yamanashi" },
    { id: "yamanashi-5", label: "大月市", prefId: "yamanashi" },
    { id: "nagano-1", label: "上田市", prefId: "nagano" },
    { id: "nagano-2", label: "佐久市", prefId: "nagano" },
    { id: "nagano-3", label: "伊那市", prefId: "nagano" },
    { id: "nagano-4", label: "飯田市", prefId: "nagano" },
    { id: "nagano-5", label: "長野市", prefId: "nagano" },
    { id: "nagano-6", label: "安曇野市", prefId: "nagano" },
    { id: "nagano-7", label: "諏訪市", prefId: "nagano" },
    { id: "nagano-8", label: "松本市", prefId: "nagano" },
    { id: "nagano-9", label: "茅野市", prefId: "nagano" },
    { id: "nagano-10", label: "上水内郡信濃町", prefId: "nagano" },
    { id: "nagano-11", label: "小諸市", prefId: "nagano" },
    { id: "nagano-12", label: "上伊那郡箕輪町", prefId: "nagano" },
    { id: "nagano-13", label: "千曲市", prefId: "nagano" },
    { id: "nagano-14", label: "岡谷市", prefId: "nagano" },
    { id: "nagano-15", label: "北安曇郡池田町", prefId: "nagano" },
    { id: "gifu-1", label: "岐阜市", prefId: "gifu" },
    { id: "gifu-2", label: "各務原市", prefId: "gifu" },
    { id: "gifu-3", label: "可児市", prefId: "gifu" },
    { id: "gifu-4", label: "大垣市", prefId: "gifu" },
    { id: "gifu-5", label: "美濃加茂市", prefId: "gifu" },
    { id: "gifu-6", label: "羽島市", prefId: "gifu" },
    { id: "gifu-7", label: "安八郡神戸町", prefId: "gifu" },
    { id: "gifu-8", label: "羽島郡岐南町", prefId: "gifu" },
    { id: "gifu-9", label: "多治見市", prefId: "gifu" },
    { id: "gifu-10", label: "中津川市", prefId: "gifu" },
    { id: "gifu-11", label: "海津市", prefId: "gifu" },
    { id: "gifu-12", label: "養老郡養老町", prefId: "gifu" },
    { id: "gifu-13", label: "高山市", prefId: "gifu" },
    { id: "gifu-14", label: "不破郡関ヶ原町", prefId: "gifu" },
    { id: "gifu-15", label: "加茂郡坂祝町", prefId: "gifu" },
    { id: "gifu-16", label: "揖斐郡池田町", prefId: "gifu" },
    { id: "gifu-17", label: "羽島郡笠松町", prefId: "gifu" },
    { id: "shizuoka-1", label: "浜松市", prefId: "shizuoka" },
    { id: "shizuoka-2", label: "沼津市", prefId: "shizuoka" },
    { id: "shizuoka-3", label: "静岡市", prefId: "shizuoka" },
    { id: "shizuoka-4", label: "三島市", prefId: "shizuoka" },
    { id: "shizuoka-5", label: "富士市", prefId: "shizuoka" },
    { id: "shizuoka-6", label: "湖西市", prefId: "shizuoka" },
    { id: "shizuoka-7", label: "焼津市", prefId: "shizuoka" },
    { id: "shizuoka-8", label: "富士宮市", prefId: "shizuoka" },
    { id: "shizuoka-9", label: "島田市", prefId: "shizuoka" },
    { id: "shizuoka-10", label: "磐田市", prefId: "shizuoka" },
    { id: "shizuoka-11", label: "駿東郡清水町", prefId: "shizuoka" },
    { id: "shizuoka-12", label: "御前崎市", prefId: "shizuoka" },
    { id: "shizuoka-13", label: "伊東市", prefId: "shizuoka" },
    { id: "shizuoka-14", label: "掛川市", prefId: "shizuoka" },
    { id: "shizuoka-15", label: "田方郡函南町", prefId: "shizuoka" },
    { id: "shizuoka-16", label: "御殿場市", prefId: "shizuoka" },
    { id: "shizuoka-17", label: "藤枝市", prefId: "shizuoka" },
    { id: "shizuoka-18", label: "周智郡森町", prefId: "shizuoka" },
    { id: "shizuoka-19", label: "榛原郡吉田町", prefId: "shizuoka" },
    { id: "shizuoka-20", label: "袋井市", prefId: "shizuoka" },
    { id: "aichi-1", label: "名古屋市", prefId: "aichi" },
    { id: "aichi-2", label: "豊橋市", prefId: "aichi" },
    { id: "aichi-3", label: "岡崎市", prefId: "aichi" },
    { id: "aichi-4", label: "安城市", prefId: "aichi" },
    { id: "aichi-5", label: "一宮市", prefId: "aichi" },
    { id: "aichi-6", label: "豊田市", prefId: "aichi" },
    { id: "aichi-7", label: "小牧市", prefId: "aichi" },
    { id: "aichi-8", label: "春日井市", prefId: "aichi" },
    { id: "aichi-9", label: "西尾市", prefId: "aichi" },
    { id: "aichi-10", label: "刈谷市", prefId: "aichi" },
    { id: "aichi-11", label: "知立市", prefId: "aichi" },
    { id: "aichi-12", label: "あま市", prefId: "aichi" },
    { id: "aichi-13", label: "江南市", prefId: "aichi" },
    { id: "aichi-14", label: "みよし市", prefId: "aichi" },
    { id: "aichi-15", label: "豊川市", prefId: "aichi" },
    { id: "aichi-16", label: "碧南市", prefId: "aichi" },
    { id: "aichi-17", label: "稲沢市", prefId: "aichi" },
    { id: "aichi-18", label: "半田市", prefId: "aichi" },
    { id: "aichi-19", label: "蒲郡市", prefId: "aichi" },
    { id: "aichi-20", label: "津島市", prefId: "aichi" },
    { id: "mie-1", label: "四日市", prefId: "mie" },
    { id: "mie-2", label: "松阪市", prefId: "mie" },
    { id: "mie-3", label: "桑名市", prefId: "mie" },
    { id: "mie-4", label: "伊勢市", prefId: "mie" },
    { id: "mie-5", label: "亀山市", prefId: "mie" },
    { id: "mie-6", label: "津市香良洲町", prefId: "mie" },
    { id: "mie-7", label: "津市久居幸町", prefId: "mie" },
    { id: "mie-8", label: "津市芸濃町", prefId: "mie" },
    { id: "mie-9", label: "津市白山町", prefId: "mie" },
    { id: "mie-10", label: "津市上浜町", prefId: "mie" },
    { id: "mie-11", label: "津市久居新町", prefId: "mie" },
    { id: "mie-12", label: "いなべ市", prefId: "mie" },
    { id: "mie-13", label: "三重郡菰野町", prefId: "mie" },
    { id: "mie-14", label: "鈴鹿市", prefId: "mie" },
    { id: "shiga-1", label: "彦根市", prefId: "shiga" },
    { id: "shiga-2", label: "長浜市", prefId: "shiga" },
    { id: "shiga-3", label: "草津市", prefId: "shiga" },
    { id: "shiga-4", label: "東近江市", prefId: "shiga" },
    { id: "shiga-5", label: "米原市", prefId: "shiga" },
    { id: "shiga-6", label: "甲賀市", prefId: "shiga" },
    { id: "shiga-7", label: "湖南市", prefId: "shiga" },
    { id: "shiga-8", label: "大津市", prefId: "shiga" },
    { id: "shiga-9", label: "蒲生郡竜王町", prefId: "shiga" },
    { id: "shiga-10", label: "近江八幡市", prefId: "shiga" },
    { id: "shiga-11", label: "野洲市", prefId: "shiga" },
    { id: "shiga-12", label: "蒲生郡日野町", prefId: "shiga" },
    { id: "shiga-13", label: "守山市", prefId: "shiga" },
    { id: "kyoto-1", label: "京都市", prefId: "kyoto" },
    { id: "kyoto-2", label: "亀岡市", prefId: "kyoto" },
    { id: "kyoto-3", label: "舞鶴市", prefId: "kyoto" },
    { id: "kyoto-4", label: "綴喜郡井手町", prefId: "kyoto" },
    { id: "kyoto-5", label: "福知山市", prefId: "kyoto" },
    { id: "kyoto-6", label: "木津川市", prefId: "kyoto" },
    { id: "kyoto-7", label: "京田辺市", prefId: "kyoto" },
    { id: "kyoto-8", label: "京丹後市", prefId: "kyoto" },
    { id: "osaka-1", label: "大阪市", prefId: "osaka" },
    { id: "osaka-2", label: "東大阪市", prefId: "osaka" },
    { id: "osaka-3", label: "堺市堺区", prefId: "osaka" },
    { id: "osaka-4", label: "枚方市", prefId: "osaka" },
    { id: "osaka-5", label: "茨木市", prefId: "osaka" },
    { id: "osaka-6", label: "富田林市", prefId: "osaka" },
    { id: "osaka-7", label: "門真市", prefId: "osaka" },
    { id: "osaka-8", label: "吹田市", prefId: "osaka" },
    { id: "osaka-9", label: "泉南郡岬町", prefId: "osaka" },
    { id: "osaka-10", label: "泉南市", prefId: "osaka" },
    { id: "osaka-11", label: "八尾市", prefId: "osaka" },
    { id: "osaka-12", label: "摂津市", prefId: "osaka" },
    { id: "osaka-13", label: "豊中市", prefId: "osaka" },
    { id: "osaka-14", label: "守口市", prefId: "osaka" },
    { id: "osaka-15", label: "泉大津市", prefId: "osaka" },
    { id: "osaka-16", label: "堺市北区", prefId: "osaka" },
    { id: "osaka-17", label: "高槻市", prefId: "osaka" },
    { id: "osaka-18", label: "大阪狭山市", prefId: "osaka" },
    { id: "osaka-19", label: "泉南郡熊取町", prefId: "osaka" },
    { id: "osaka-20", label: "泉北郡忠岡町", prefId: "osaka" },
    { id: "hyogo-1", label: "神戸市", prefId: "hyogo" },
    { id: "hyogo-2", label: "姫路市", prefId: "hyogo" },
    { id: "hyogo-3", label: "尼崎市", prefId: "hyogo" },
    { id: "hyogo-4", label: "西宮市", prefId: "hyogo" },
    { id: "hyogo-5", label: "川辺郡猪名川町", prefId: "hyogo" },
    { id: "hyogo-6", label: "南あわじ市", prefId: "hyogo" },
    { id: "hyogo-7", label: "宝塚市", prefId: "hyogo" },
    { id: "hyogo-8", label: "多可郡多可町", prefId: "hyogo" },
    { id: "hyogo-9", label: "小野市", prefId: "hyogo" },
    { id: "hyogo-10", label: "芦屋市", prefId: "hyogo" },
    { id: "hyogo-11", label: "淡路市", prefId: "hyogo" },
    { id: "hyogo-12", label: "高砂市", prefId: "hyogo" },
    { id: "hyogo-13", label: "川西市", prefId: "hyogo" },
    { id: "hyogo-14", label: "洲本市", prefId: "hyogo" },
    { id: "hyogo-15", label: "明石市", prefId: "hyogo" },
    { id: "nara-1", label: "奈良市", prefId: "nara" },
    { id: "nara-2", label: "生駒市", prefId: "nara" },
    { id: "nara-3", label: "大和郡山市", prefId: "nara" },
    { id: "nara-4", label: "宇陀市", prefId: "nara" },
    { id: "nara-5", label: "橿原市", prefId: "nara" },
    { id: "nara-6", label: "吉野郡下市", prefId: "nara" },
    { id: "nara-7", label: "磯城郡三宅町", prefId: "nara" },
    { id: "nara-8", label: "大和高田市", prefId: "nara" },
    { id: "nara-9", label: "北葛城郡広陵町", prefId: "nara" },
    { id: "nara-10", label: "五條市", prefId: "nara" },
    { id: "nara-11", label: "磯城郡田原本町", prefId: "nara" },
    { id: "wakayama-1", label: "県和歌山市", prefId: "wakayama" },
    { id: "wakayama-2", label: "県御坊市", prefId: "wakayama" },
    { id: "wakayama-3", label: "県日高郡美浜町", prefId: "wakayama" },
    { id: "wakayama-4", label: "県岩出市", prefId: "wakayama" },
    { id: "tottori-1", label: "鳥取市", prefId: "tottori" },
    { id: "tottori-2", label: "境港市", prefId: "tottori" },
    { id: "tottori-3", label: "倉吉市", prefId: "tottori" },
    { id: "shimane-1", label: "浜田市", prefId: "shimane" },
    { id: "shimane-2", label: "松江市", prefId: "shimane" },
    { id: "shimane-3", label: "江津市", prefId: "shimane" },
    { id: "shimane-4", label: "出雲市", prefId: "shimane" },
    { id: "okayama-1", label: "岡山市", prefId: "okayama" },
    { id: "okayama-2", label: "倉敷市", prefId: "okayama" },
    { id: "okayama-3", label: "赤磐市", prefId: "okayama" },
    { id: "okayama-4", label: "総社市", prefId: "okayama" },
    { id: "okayama-5", label: "笠岡市", prefId: "okayama" },
    { id: "okayama-6", label: "備前市", prefId: "okayama" },
    { id: "okayama-7", label: "美作市", prefId: "okayama" },
    { id: "okayama-8", label: "瀬戸内市", prefId: "okayama" },
    { id: "hiroshima-1", label: "広島市", prefId: "hiroshima" },
    { id: "hiroshima-2", label: "福山市", prefId: "hiroshima" },
    { id: "hiroshima-3", label: "尾道市", prefId: "hiroshima" },
    { id: "hiroshima-4", label: "東広島市", prefId: "hiroshima" },
    { id: "hiroshima-5", label: "廿日市", prefId: "hiroshima" },
    { id: "hiroshima-6", label: "呉市安浦町", prefId: "hiroshima" },
    { id: "hiroshima-7", label: "三原市", prefId: "hiroshima" },
    { id: "hiroshima-8", label: "江田島市", prefId: "hiroshima" },
    { id: "hiroshima-9", label: "安芸郡海田町", prefId: "hiroshima" },
    { id: "hiroshima-10", label: "呉市音戸町", prefId: "hiroshima" },
    { id: "hiroshima-11", label: "呉市広文化町", prefId: "hiroshima" },
    { id: "hiroshima-12", label: "呉市昭和町", prefId: "hiroshima" },
    { id: "hiroshima-13", label: "府中市", prefId: "hiroshima" },
    { id: "hiroshima-14", label: "庄原市", prefId: "hiroshima" },
    { id: "yamaguchi-1", label: "下関市", prefId: "yamaguchi" },
    { id: "yamaguchi-2", label: "防府市", prefId: "yamaguchi" },
    { id: "yamaguchi-3", label: "宇部市", prefId: "yamaguchi" },
    { id: "yamaguchi-4", label: "山口市", prefId: "yamaguchi" },
    { id: "yamaguchi-5", label: "山陽小野田市", prefId: "yamaguchi" },
    { id: "yamaguchi-6", label: "玖珂郡和木町", prefId: "yamaguchi" },
    { id: "yamaguchi-7", label: "周南市", prefId: "yamaguchi" },
    { id: "yamaguchi-8", label: "岩国市", prefId: "yamaguchi" },
    { id: "yamaguchi-9", label: "下松市", prefId: "yamaguchi" },
    { id: "tokushima-1", label: "徳島市", prefId: "tokushima" },
    { id: "tokushima-2", label: "吉野川市", prefId: "tokushima" },
    { id: "tokushima-3", label: "鳴門市", prefId: "tokushima" },
    { id: "tokushima-4", label: "阿波市", prefId: "tokushima" },
    { id: "tokushima-5", label: "海部郡海陽町", prefId: "tokushima" },
    { id: "tokushima-6", label: "小松島市", prefId: "tokushima" },
    { id: "tokushima-7", label: "板野郡上板町", prefId: "tokushima" },
    { id: "kagawa-1", label: "高松市", prefId: "kagawa" },
    { id: "kagawa-2", label: "三豊市", prefId: "kagawa" },
    { id: "kagawa-3", label: "丸亀市", prefId: "kagawa" },
    { id: "kagawa-4", label: "坂出市", prefId: "kagawa" },
    { id: "kagawa-5", label: "観音寺市", prefId: "kagawa" },
    { id: "kagawa-6", label: "さぬき市", prefId: "kagawa" },
    { id: "kagawa-7", label: "綾歌郡宇多津町", prefId: "kagawa" },
    { id: "ehime-1", label: "松山市", prefId: "ehime" },
    { id: "ehime-2", label: "今治市", prefId: "ehime" },
    { id: "ehime-3", label: "南宇和郡愛南町", prefId: "ehime" },
    { id: "ehime-4", label: "伊予郡松前町", prefId: "ehime" },
    { id: "ehime-5", label: "新居浜市", prefId: "ehime" },
    { id: "ehime-6", label: "西条市", prefId: "ehime" },
    { id: "kochi-1", label: "香美市", prefId: "kochi" },
    { id: "kochi-2", label: "高知市", prefId: "kochi" },
    { id: "kochi-3", label: "幡多郡三原村", prefId: "kochi" },
    { id: "fukuoka-1", label: "福岡市", prefId: "fukuoka" },
    { id: "fukuoka-2", label: "北九州市", prefId: "fukuoka" },
    { id: "fukuoka-3", label: "久留米市", prefId: "fukuoka" },
    { id: "fukuoka-4", label: "八女市", prefId: "fukuoka" },
    { id: "fukuoka-5", label: "築上郡築上町", prefId: "fukuoka" },
    { id: "fukuoka-6", label: "那珂川市", prefId: "fukuoka" },
    { id: "fukuoka-7", label: "糸島市", prefId: "fukuoka" },
    { id: "fukuoka-8", label: "糟屋郡志免町", prefId: "fukuoka" },
    { id: "fukuoka-9", label: "大野城市", prefId: "fukuoka" },
    { id: "fukuoka-10", label: "飯塚市", prefId: "fukuoka" },
    { id: "fukuoka-11", label: "大牟田市", prefId: "fukuoka" },
    { id: "fukuoka-12", label: "京都郡苅田町", prefId: "fukuoka" },
    { id: "fukuoka-13", label: "宮若市", prefId: "fukuoka" },
    { id: "fukuoka-14", label: "豊前市", prefId: "fukuoka" },
    { id: "fukuoka-15", label: "筑後市", prefId: "fukuoka" },
    { id: "fukuoka-16", label: "柳川市", prefId: "fukuoka" },
    { id: "fukuoka-17", label: "糟屋郡宇美町", prefId: "fukuoka" },
    { id: "fukuoka-18", label: "鞍手郡鞍手町", prefId: "fukuoka" },
    { id: "fukuoka-19", label: "小郡市", prefId: "fukuoka" },
    { id: "fukuoka-20", label: "筑紫野市", prefId: "fukuoka" },
    { id: "saga-1", label: "佐賀市", prefId: "saga" },
    { id: "saga-2", label: "唐津市", prefId: "saga" },
    { id: "nagasaki-1", label: "佐世保市", prefId: "nagasaki" },
    { id: "nagasaki-2", label: "長崎市", prefId: "nagasaki" },
    { id: "nagasaki-3", label: "雲仙市", prefId: "nagasaki" },
    { id: "nagasaki-4", label: "諫早市", prefId: "nagasaki" },
    { id: "nagasaki-5", label: "西海市", prefId: "nagasaki" },
    { id: "nagasaki-6", label: "平戸市", prefId: "nagasaki" },
    { id: "nagasaki-7", label: "大村市", prefId: "nagasaki" },
    { id: "kumamoto-1", label: "熊本市", prefId: "kumamoto" },
    { id: "kumamoto-2", label: "阿蘇郡小国町", prefId: "kumamoto" },
    { id: "kumamoto-3", label: "阿蘇市", prefId: "kumamoto" },
    { id: "kumamoto-4", label: "菊池郡大津町", prefId: "kumamoto" },
    { id: "kumamoto-5", label: "宇土市", prefId: "kumamoto" },
    { id: "kumamoto-6", label: "合志市", prefId: "kumamoto" },
    { id: "kumamoto-7", label: "宇城市", prefId: "kumamoto" },
    { id: "kumamoto-8", label: "玉名市", prefId: "kumamoto" },
    { id: "kumamoto-9", label: "菊池郡菊陽町", prefId: "kumamoto" },
    { id: "oita-1", label: "大分市", prefId: "oita" },
    { id: "oita-2", label: "宇佐市", prefId: "oita" },
    { id: "oita-3", label: "日田市", prefId: "oita" },
    { id: "oita-4", label: "豊後大野市", prefId: "oita" },
    { id: "oita-5", label: "豊後高田市", prefId: "oita" },
    { id: "miyazaki-1", label: "宮崎市", prefId: "miyazaki" },
    { id: "miyazaki-2", label: "日南市", prefId: "miyazaki" },
    { id: "miyazaki-3", label: "都城市", prefId: "miyazaki" },
    { id: "miyazaki-4", label: "西都市", prefId: "miyazaki" },
    { id: "miyazaki-5", label: "串間市", prefId: "miyazaki" },
    { id: "kagoshima-1", label: "県鹿児島市", prefId: "kagoshima" },
    { id: "kagoshima-2", label: "県鹿屋市", prefId: "kagoshima" },
    { id: "kagoshima-3", label: "県姶良市", prefId: "kagoshima" },
    { id: "kagoshima-4", label: "県南九州市", prefId: "kagoshima" },
    { id: "kagoshima-5", label: "県曽於郡大崎町", prefId: "kagoshima" },
    { id: "kagoshima-6", label: "県出水市", prefId: "kagoshima" },
    { id: "kagoshima-7", label: "県志布志市", prefId: "kagoshima" },
    { id: "okinawa-1", label: "那覇市", prefId: "okinawa" },
    { id: "okinawa-2", label: "うるま市", prefId: "okinawa" },
    { id: "okinawa-3", label: "島尻郡与那原町", prefId: "okinawa" },
    { id: "okinawa-4", label: "名護市", prefId: "okinawa" },
    { id: "okinawa-5", label: "浦添市", prefId: "okinawa" },
    { id: "okinawa-6", label: "豊見城市", prefId: "okinawa" },
    { id: "okinawa-7", label: "沖縄市", prefId: "okinawa" },
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
//  pending agencies を回収（data.jsより先にprefファイルが読まれた場合の保険）
// ─────────────────────────────────────────────────────────────
if (window._pendingAgencies && window._pendingAgencies.length) {
  VISA_DATA.agencies.push(...window._pendingAgencies);
  window._pendingAgencies = [];
}

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
