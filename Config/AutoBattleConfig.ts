// export enum CareerEnum {
//     wuzhe = 1,
//     cike = 2,
//     zhenshou = 3,
//     qiudaozhe = 4,
//     yumowu = 5,
//     xianshushi = 6,
//     wushushi = 7,
//     lieshou = 8,
//     hunshushi = 9,
//     lishi = 10,
// }

// export var careerBuffConfig = {
//     [CareerEnum.wuzhe]: {
//         [3]: 9101,
//         [6]: 9102,

//     },
//     [CareerEnum.cike]: {
//         [3]: 9103,
//         [6]: 9104,
//     },
//     [CareerEnum.zhenshou]: {
//         [2]: 9105,
//         [4]: 9106,
//     },
//     [CareerEnum.qiudaozhe]: {
//         [3]: 9111,
//         [6]: 9112,
//     },
//     [CareerEnum.yumowu]: {
//         [1]: 9110,
//     },
//     [CareerEnum.xianshushi]: {
//         [2]: 0,
//     },
//     [CareerEnum.wushushi]: {
//         [2]: 9107,
//     },
//     [CareerEnum.lieshou]: {
//         [3]: 9108,
//         [6]: 9109,
//     },
//     [CareerEnum.hunshushi]: {
//         [2]: 9113,
//         [4]: 9114,
//     },
//     [CareerEnum.lishi]: {
//         [2]: 9115,
//         [4]: 9116,
//         [6]: 9117,
//     },
// }

// export enum RaceEnum {
//     yao,
//     shen,
//     shou,
//     xiuluo,
//     ling,
//     mo,
//     ren,
//     gui,
//     yi,
//     kui,
//     ming,
// }

// export var raceBuffConfig = {
//     [RaceEnum.yao]: {
//         [2]: 9001,
//         [4]: 9002,
//     },
//     [RaceEnum.shen]: {
//         [2]: 9016,
//         [4]: 9017,
//         [6]: 9018,
//     },
//     [RaceEnum.shou]: {
//         [3]: 9003,
//         [6]: 9004,
//     },
//     [RaceEnum.xiuluo]: {
//         [1]: 9005,
//     },
//     [RaceEnum.ling]: {
//         [3]: 9019,
//         [6]: 9020,
//     },
//     [RaceEnum.mo]: {
//         [1]: 9006,
//     },
//     [RaceEnum.ren]: {
//         [2]: 9007,
//         [4]: 9008,
//     },
//     [RaceEnum.gui]: {
//         [2]: 9009,
//         [4]: 9010,
//     },
//     [RaceEnum.yi]: {
//         [2]: 9011,
//         [4]: 9012,
//         [5]: 9013,
//     },
//     [RaceEnum.kui]: {
//         [3]: 9021,
//     },
//     [RaceEnum.ming]: {
//         [2]: 9014,
//         [4]: 9015,
//     },
// }

export enum CareerEnum {
    warrior = 1,
    magic = 2,
    assissan = 3,
}

export var careerBuffConfig: any = {
    [CareerEnum.warrior]: {
        [3]: 2011,
        [6]: 2012,

    },
    [CareerEnum.magic]: {
        [3]: 2021,
        [6]: 2022,
    },
    [CareerEnum.assissan]: {
        [3]: 2031,
        [6]: 2032,
    },
}

export enum RaceEnum {
    orc = 1,
    wild,
    human,
    bloodElf,
    dwarf,
    troll,
}

export var raceBuffConfig: any = {
    [RaceEnum.orc]: {
        [2]: 3011,
        [4]: 3012,
    },
    [RaceEnum.wild]: {
        [2]: 3021,
        [4]: 3022,
    },
    [RaceEnum.human]: {
        [2]: 3031,
        [4]: 3032,
    },
    [RaceEnum.bloodElf]: {
        [2]: 3041,
        [4]: 3042,
    },
    [RaceEnum.dwarf]: {
        [2]: 3051,
        [4]: 3052,
    },
    [RaceEnum.troll]: {
        [2]: 3061,
        [4]: 3062,
    },
}


export var dirConfig = [
    { x: 0, y: -1, },
    { x: 1, y: -1, },
    { x: 1, y: 0, },
    { x: 1, y: 1, },
    { x: 0, y: 1, },
    { x: -1, y: 1, },
    { x: -1, y: 0, },
    { x: -1, y: -1, },
]

export var attackRangeConfig = [
    [0],
    [1, 0],
    [2, 1, 0],
    [3, 3, 2, 1],
    [4, 4, 4, 3, 2],
    [5, 5, 5, 5, 4, 3],
    [6, 6, 6, 6, 5, 4, 3],
    [7, 7, 7, 7, 6, 6, 5, 3]
]

export var ATTACK_BASE_TIME = 1.5

export var damageK = {
    k1: 0.04,
    k2: 1,
    k3: 0.04,
}