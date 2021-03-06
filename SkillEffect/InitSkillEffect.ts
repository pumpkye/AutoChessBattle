import { SkillEffectEnum } from "./SkillEffectEnum";
import { Damage } from "./Damage";
import { BaseSkillEffect } from "./BaseSkillEffect";
import { LineDamage } from "./LineDamage";
import { CircleDamage } from "./CircleDamage";
import { AddDefence } from "./AddDefence";
import { Sneer } from "./Sneer";
import { SwordStorm } from "./SwordStorm";
import { AddMaxHp } from "./AddMaxHp";
import { ChainHeal } from "./ChainHeal";
import { ChainLightning } from "./ChainLightning";
import { Tear } from "./Tear";
import { Sweep } from "./Sweep";
import { Roar } from "./Roar";
import { Crit } from "./Crit";
import { MulDamage } from "./MulDamage";
import { WarCry } from "./WarCry";
import { Bang } from "./Bang";
import { RecoverMpRange } from "./RecoverMpRange";
import { MagicRing } from "./MagicRing";
import { CritSilent } from "./CritSilent";
import { ManaBurn } from "./ManaBurn";
import { Banish } from "./Banish";
import { ThunderClap } from "./ThunderClap";
import { GodAvatar } from "./GodAvatar";
import { FlashBoom } from "./FlashBoom";
import { WarFever } from "./WarFever";
import { BloodthirstySpear } from "./BloodthirstySpear";
import { BloodthirstySpearBuff } from "./BloodthirstySpearBuff";
import { BloodSacrifice } from "./BloodSacrifice";
import { Boom } from "./Boom";
import { AddMDefence } from "./AddMDefence";
import { ReduceCd } from "./ReduceCd";
import { AddAttackSpeed } from "./AddAttackSpeed";
import { Tenacity } from "./Tenacity";
import { RecoverHp } from "./RecoverHp";
import { Summon } from "./Summon";
import { Sputtering } from "./Sputtering";
import { Refraction } from "./Refraction";
import { BigFireBall } from "./BigFireBall";
export var skillEffects = new Array<BaseSkillEffect>();
skillEffects[SkillEffectEnum.baseEffect] = new BaseSkillEffect();
skillEffects[SkillEffectEnum.damage] = new Damage();
skillEffects[SkillEffectEnum.circleDamage] = new CircleDamage();
skillEffects[SkillEffectEnum.lineDamage] = new LineDamage();
skillEffects[SkillEffectEnum.addDefence] = new AddDefence();
skillEffects[SkillEffectEnum.addMDefence] = new AddMDefence();
skillEffects[SkillEffectEnum.reduceCd] = new ReduceCd();
skillEffects[SkillEffectEnum.addAttackSpeed] = new AddAttackSpeed();
skillEffects[SkillEffectEnum.sneer] = new Sneer();
skillEffects[SkillEffectEnum.swordStorm] = new SwordStorm();
skillEffects[SkillEffectEnum.addMaxHp] = new AddMaxHp();
skillEffects[SkillEffectEnum.chainHeal] = new ChainHeal();
skillEffects[SkillEffectEnum.chainLightning] = new ChainLightning();
skillEffects[SkillEffectEnum.tear] = new Tear();
skillEffects[SkillEffectEnum.sweep] = new Sweep();
skillEffects[SkillEffectEnum.roar] = new Roar();
skillEffects[SkillEffectEnum.crit] = new Crit();
skillEffects[SkillEffectEnum.mulDamage] = new MulDamage();
skillEffects[SkillEffectEnum.warCry] = new WarCry();
skillEffects[SkillEffectEnum.bang] = new Bang();
skillEffects[SkillEffectEnum.recoverMpRange] = new RecoverMpRange();
skillEffects[SkillEffectEnum.magicRing] = new MagicRing();
skillEffects[SkillEffectEnum.critSilent] = new CritSilent();
skillEffects[SkillEffectEnum.manaBurn] = new ManaBurn();
skillEffects[SkillEffectEnum.banish] = new Banish();
skillEffects[SkillEffectEnum.thunderClap] = new ThunderClap();
skillEffects[SkillEffectEnum.godAvatar] = new GodAvatar();
skillEffects[SkillEffectEnum.flashBoom] = new FlashBoom();
skillEffects[SkillEffectEnum.warFever] = new WarFever();
skillEffects[SkillEffectEnum.bloodthirstySpear] = new BloodthirstySpear();
skillEffects[SkillEffectEnum.bloodthirstySpearBuff] = new BloodthirstySpearBuff();
skillEffects[SkillEffectEnum.bloodSacrifice] = new BloodSacrifice();
skillEffects[SkillEffectEnum.boom] = new Boom();
skillEffects[SkillEffectEnum.tenacity] = new Tenacity();
skillEffects[SkillEffectEnum.recoverHp] = new RecoverHp();
skillEffects[SkillEffectEnum.summon] = new Summon();
skillEffects[SkillEffectEnum.sputtering] = new Sputtering();
skillEffects[SkillEffectEnum.refraction] = new Refraction();
skillEffects[SkillEffectEnum.bigFireBall] = new BigFireBall();