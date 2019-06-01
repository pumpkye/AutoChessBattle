import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum, DamageType } from "./SkillEffectEnum";
import { EffData, EffectInfo } from "../Model/EffectInfo";
import { ChessNpc } from "../Model/ChessNpc";
import { dirConfig } from "../Config/AutoBattleConfig";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { g_Util } from "../Util";
import { skillEffects } from "./InitSkillEffect";

/**
 * 对当前方向一条长度为[0],宽度为[1]的直线上的目标造成[2]点魔法伤害
 */
export class LineDamage extends BaseSkillEffect {
    constructor() {
        super();
    }

    public get effectId(): number {
        return SkillEffectEnum.lineDamage;
    }

    public get effName(): string {
        return "lineDamage";
    }

    /**
     * play
     */
    public play(data: EffData): boolean {
        super.play(data);
        let skillEff = data.skillEff;
        let length = skillEff.effArr[0];
        let width = skillEff.effArr[1];
        let damage = skillEff.effArr[2];

        let effArr = new Array<number>();
        effArr.push(damage);
        effArr.push(DamageType.magic);
        let effInfo = new EffectInfo();
        effInfo.init(SkillEffectEnum.damage, effArr);

        let linePos = new Array<{ x: number, y: number }>();
        let dirT = dirConfig[data.attacker.dir];
        for (let i = 0; i < length; i++) {
            let posX = data.attacker.posX + dirT.x * i;
            let posY = data.attacker.posY + dirT.y * i;
            if (posX > -1 && posX < 8 && posY > -1 && posY < 8) {
                linePos.push({ x: posX, y: posY });
            } else {
                break;
            }
        }


        let hitNpc = new Array<ChessNpc>();
        for (let i = 0; i < g_AutoBattleManager.getEnemyList(data.attacker).length; i++) {
            const npc = g_AutoBattleManager.getEnemyList(data.attacker)[i];
            for (let j = 0; j < linePos.length; j++) {
                const center = linePos[j];
                if (g_Util.checkPosShortInRange(center.x, center.y, npc.posX, npc.posY, width)) {
                    hitNpc.push(npc);
                    break;
                }
            }
        }

        for (let i = 0; i < hitNpc.length; i++) {
            const defender = hitNpc[i];
            let effData = new EffData(effInfo, data.attacker, defender);
            skillEffects[SkillEffectEnum.damage].play(effData);
        }
        return true;
    }
}