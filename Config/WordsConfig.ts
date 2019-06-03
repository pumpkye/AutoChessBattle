import { CareerEnum, RaceEnum } from "./AutoBattleConfig";

// CareerEnum

export const WorsConfig = {
    career: {
        [CareerEnum.warrior]: "战士",
        [CareerEnum.magic]: "法师",
        [CareerEnum.assissan]: "刺客",
    },
    race: {
        [RaceEnum.orc]: "兽人",
        [RaceEnum.wild]: "野兽",
        [RaceEnum.human]: "人类",
        [RaceEnum.bloodElf]: "血精灵",
        [RaceEnum.dwarf]: "矮人",
        [RaceEnum.troll]: "巨魔",
    }
}