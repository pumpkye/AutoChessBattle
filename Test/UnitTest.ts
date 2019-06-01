import { SkillBaseData } from "../TbxModel/SkillBaseData";
import { ChessNpcBaseData } from "../TbxModel/ChessNpcBaseData";
import { skillLevelData } from "../TbxModel/SkillLevelData";
export function testSkillBaseData() {
    let skillBase = new SkillBaseData(1);
    console.log(skillBase);
}

export function testNpcBaseData() {
    let data = new ChessNpcBaseData(1);
    console.log(data);
}

export function testSkillLevelData() {
    let data = new skillLevelData(101)
    console.log(data);
}