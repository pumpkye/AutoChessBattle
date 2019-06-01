import { BaseSkillEffect } from "./BaseSkillEffect";
import { SkillEffectEnum } from "./SkillEffectEnum";
import { EffData } from "../Model/EffectInfo";
import { AttrChangeInfo } from "../Model/ChessBuff";
/**
 * 暴击时触发效果，沉默当前目标[0]秒
 */
export class CritSilent extends BaseSkillEffect {
    constructor() {
        super();
    }
    public get effectId(): number {
        return SkillEffectEnum.critSilent;
    }
    public get effName(): string {
        return "critSilent";
    }

    public play(data: EffData): boolean {
        super.play(data);
        if (!data.defender || data.defender.isDead) {
            return false;
        }
        let silentTime = data.skillEff.effArr[0];
        data.defender.addAttrChange("critSilent", new AttrChangeInfo(silentTime));
        return true;
    }
}