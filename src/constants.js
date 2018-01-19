// 定数定義

export const EXPERIENCES = [
  {
    // 0
    name: "unexplored",
    mark: "×",
    text: "未踏",
    subtext: "未経県",
    color: "#f5f5f5",
  },
  {
    // 1
    name: "passage",
    mark: "▲",
    text: "通過",
    subtext: "通過した",
    color: "#00ffff",
  },
  {
    // 2
    name: "earthing",
    mark: "△",
    text: "接地",
    subtext: "降り立った",
    color: "#00ff00",
  },
  {
    // 3
    name: "visit",
    mark: "●",
    text: "訪問",
    subtext: "歩いた",
    color: "#ffff00",
  },
  {
    // 4
    name: "stay",
    mark: "○",
    text: "宿泊",
    subtext: "泊まった",
    color: "#ff0000",
  },
  {
    // 5
    name: "live",
    mark: "◎",
    text: "居住",
    subtext: "住んだ",
    color: "#ff00ff",
  }
];

export const EXPERIENCES_REVERSE = [ ...EXPERIENCES ].reverse();

export const TITLES = [
  '生涯経県値',
  '2018年の経県値',
  '2017年の経県値',
  '2016年の経県値',
  '2015年の経県値',
  'プライベートの経県値',
  'ビジネスの経県値',
  '夫婦同伴の経県値',
  '親子同伴の経県値',
  '彼女・彼氏との経県値',
  '大学卒業時の経県値',
  '高校卒業時の経県値',
  '中学校卒業時の経県値',
  '小学校卒業時の経県値',
  '鉄道利用の経県値',
  '車・バス利用の経県値',
  '都道府県庁所在地の経県値',
];
