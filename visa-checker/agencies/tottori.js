// tottori (23件)
(function(){
  const data = [
    { name: "テクノライフサービス株式会社", type: "登録支援機関", address: "鳥取県鳥取市布勢１０３番地２", tel: "0857300505", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "一般社団法人境港水産振興協会", type: "登録支援機関", address: "鳥取県境港市昭和町９－３３", tel: "0859446668", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-2" },
    { name: "情報リンク協同組合", type: "登録支援機関", address: "鳥取県鳥取市正蓮寺４３番地２５", tel: "0857295101", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "ＰＲＯＰＲＯ株式会社", type: "登録支援機関", address: "鳥取県倉吉市上井３６０番地１小笹ビル１階１号", tel: "0858389032", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-3" },
    { name: "スキルウェイ協同組合", type: "登録支援機関", address: "鳥取県鳥取市田島６４８番地", tel: "0857303110", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市田島６６３番地２", tel: "0857295050", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市今町１丁目２７４－２　１階", tel: "08038875037", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県岩美郡岩美町大字大谷２１８２番地７６７", tel: "0857735007", visa: ["tokutei1"], prefId: "tottori", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市丸山町３１０－３", tel: "09032744991", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市三津６０６番地２", tel: "09036383611", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市田島６４８番地", tel: "0857255503", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県米子市尾高１３８６番地", tel: "05035385993", visa: ["tokutei1"], prefId: "tottori", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市西品治８４８番地", tel: "0857230602", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市千代水四丁目１８番地", tel: "0857510575", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県米子市内町４６番地", tel: "0859302188", visa: ["tokutei1"], prefId: "tottori", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県倉吉市見日町３４６番地", tel: "09013301861", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-3" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県境港市昭和町９番地３３流通会館１階", tel: "0859215633", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-2" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市瓦町１０１番地", tel: "0858876001", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県八頭郡八頭町富枝２３５番地２２", tel: "0899421248", visa: ["tokutei1"], prefId: "tottori", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県八頭郡八頭町大字宮谷２４０番地１５", tel: "0858730037", visa: ["tokutei1"], prefId: "tottori", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県西伯郡伯耆町岩立１６番地９", tel: "0859304988", visa: ["tokutei1"], prefId: "tottori", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市吉成７７９番地３９日本海ビル１０１", tel: "0857536788", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "鳥取県鳥取市田島７９３ー８", tel: "08063274985", visa: ["tokutei1"], prefId: "tottori", districtId: "tottori-1" },
  ];
  if (window.VISA_DATA) VISA_DATA.agencies.push(...data);
})();