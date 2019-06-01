import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { g_AutoBattleManager } from "../AutoBattleManager";
import { ChessBuff } from "../Model/ChessBuff";
/**
 * 战吼，使得自己和周围[0]格单位受到的伤害减少[1]%,持续[2]秒
 */
export class WarCry extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.warCry;
    }
    public get effName(): string {
        return "warCry";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.attacker || data.attacker.isDead) {
            return false;
        }
        let range = data.skillEff.effArr[0];
        let per = data.skillEff.effArr[1];
        let lifeTime = data.skillEff.effArr[2];

        let hitNpc = this.getRandomNpc(g_AutoBattleManager.getFriendList(data.attacker), 100, range, { x: data.attacker.posX, y: data.attacker.posY });
        for (let i = 0; i < hitNpc.length; i++) {
            const npc = hitNpc[i];
            let buff = new ChessBuff(lifeTime, 0, npc);
            buff.setAttrChange("warCry", per);
            npc.addBuff(buff);
        }
        return true;
    }
}