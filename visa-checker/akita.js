// 登録支援機関データ - akita (27件)
(function(){
  const data = [
    { name: "国際人材開発協同組合", type: "登録支援機関", address: "秋田県秋田市山王二丁目７番３６号　山王ソラリスビル３階", tel: "0188381428", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社メディコサービス", type: "登録支援機関", address: "秋田県湯沢市小野字東堺８４－２", tel: "0183523005", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社総合医療福祉サービス", type: "登録支援機関", address: "秋田県秋田市千秋矢留町６番２５号", tel: "0188840611", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県大仙市若竹町３３番地７", tel: "0187628543", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県能代市南元町２番３６号越前ビル２Ｆ－１", tel: "0185891571", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県能代市若松町８番１４号", tel: "0185550846", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市中通三丁目４－４７チサンマンション秋田２１０", tel: "05037086502", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県潟上市昭和大久保字街道下２４番地", tel: "0188777485", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市八橋大畑二丁目３番１号WhiteCube１F", tel: "0188386943", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県能代市二ツ井町字稗川原７９番地４５", tel: "0185710005", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市土崎港中央三丁目４番１３号", tel: "0188537689", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県仙北市田沢湖生保内字街道ノ上１１５番地", tel: "0187428580", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県にかほ市芹田字六坊１５番", tel: "0184383811", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市寺内堂ノ沢三丁目６番１６号", tel: "0188116784", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県能代市落合字中大野１１５番地４１", tel: "08082055833", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市大町一丁目３番８号秋田ディライトビル５階", tel: "0188386455", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市山王中園町１０番２号", tel: "0188831355", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市中通２丁目２番３２号山二ビル７階", tel: "0188534615", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県能代市二ツ井町字太田面１５番地１３", tel: "0185736444", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市飯島字堀川１０番地", tel: "07022315515", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県北秋田市住吉町４－２７住吉ビル２０２号室", tel: "0186678377", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県能代市二ツ井町小繋字恋の沢８２番地１", tel: "0185735219", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県大館市豊町６番８号豊マンション２０５", tel: "0186597765", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県横手市前郷二番町１１番１５号", tel: "0182388531", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県湯沢市三梨町下猿城３７番地１号", tel: "09092193398", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県仙北市田沢湖生保内字下高野７３番地７３ゲストハウス水沢温泉", tel: "0187428499", visa: ["tokutei1"], prefId: "akita", districtId: null },
    { name: "株式会社ワンステップイースト", type: "登録支援機関", address: "秋田県秋田市中通三丁目３番４８－７０５号", tel: "09064561745", visa: ["tokutei1"], prefId: "akita", districtId: null },
  ];
  if (window.VISA_DATA) VISA_DATA.agencies.push(...data);
})();