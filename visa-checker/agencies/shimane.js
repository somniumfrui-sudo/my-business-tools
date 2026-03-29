// shimane (17件)
(function(){
  const data = [
    { name: "株式会社プロテクト", type: "登録支援機関", address: "島根県松江市殿町５１７－１０４", tel: "0852595266", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-2" },
    { name: "株式会社ヒューマンサポートジャパン", type: "登録支援機関", address: "島根県江津市都野津町１９０４番地１", tel: "0855527521", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-3" },
    { name: "島根中央産業振興協同組合", type: "登録支援機関", address: "島根県浜田市内田町４３１番地", tel: "0855255590", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-1" },
    { name: "エーネット協同組合", type: "登録支援機関", address: "島根県出雲市中野町２６８番地１６", tel: "0853242720", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-4" },
    { name: "浜田商工会議所", type: "登録支援機関", address: "島根県浜田市田町１６６８番地", tel: "0855223025", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県松江市古志原六丁目１１番７号", tel: "08023881736", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-2" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県隠岐郡海士町大字福井７７６番地１７", tel: "0851421333", visa: ["tokutei1"], prefId: "shimane", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県松江市津田町305番地", tel: "0852672803", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-2" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県安来市安来町１１３３番地３", tel: "0854222558", visa: ["tokutei1"], prefId: "shimane", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県雲南市掛合町掛合２０１２番地１８", tel: "0854620106", visa: ["tokutei1"], prefId: "shimane", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県出雲市国富町８２３番地２", tel: "0853625955", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-4" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県松江市宍道町佐々布２１３０番地１", tel: "0853319160", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-2" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県益田市高津一丁目２８番１０号ラフィーネ高津１０１号", tel: "07084991813", visa: ["tokutei1"], prefId: "shimane", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県出雲市渡橋町７１３番地こうやビル１階東", tel: "0853258320", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-4" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県出雲市今市町６０９－１", tel: "09045701079", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-4" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県出雲市天神町６６４番地", tel: "0853306040", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-4" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "島根県松江市東津田町１２０１－５", tel: "0852618562", visa: ["tokutei1"], prefId: "shimane", districtId: "shimane-2" },
  ];
  if (window.VISA_DATA && VISA_DATA.agencies) {
    VISA_DATA.agencies.push(...data);
  } else {
    window._pendingAgencies = window._pendingAgencies || [];
    window._pendingAgencies.push(...data);
  }
})();