
export const LEVEL_QUESTIONS = {
    1: {
        hint: "证据搜集完毕！请选择回复二大爷的方式。",
        drawerTitle: "你需要在群里回复二大爷，你选择：",
        options: [
            { label: "嘲笑二大爷", value: "L1_A" },
            { label: "告知二大爷这张图是假的", value: "L1_B" }
        ]
    },
    2: {
        hint: "⚠️ 这是个钓鱼网站！请回群里劝阻三姑。",
        drawerTitle: "你需要在群里回复三姑，你选择：",
        options: [
            { label: "三姑你是不是傻？天上能掉馅饼吗！", value: "L2_A" },
            { label: "指出域名和索要密码的猫腻，劝她别填", value: "L2_B" }
        ]
    },
    3: {
        hint: "⚠️ 请立刻制止老妈的操作！",
        drawerTitle: "老妈正在操作，迫在眉睫，你必须立刻回复：",
        options: [
            { label: "妈你别理她，这视频里的人是AI换脸生成的假客服！", value: "L3_A" },
            { label: "挂断！开飞行模式！要求屏幕共享100%就是诈骗！", value: "L3_B" }
        ]
    }
};