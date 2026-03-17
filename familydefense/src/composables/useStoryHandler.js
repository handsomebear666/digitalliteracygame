import { gameStore as store } from "../store/gameStore.js";
import { GAME_STORY } from "../config/story.js";

export function useStoryHandler() {
  const handleChoice = (val) => {
    // ----------- 第一关 -----------
    if (val === "L1_A") {
      store.pushMessage({
        sender: "我",
        text: "二大爷你可长点心吧，哈哈哈哈这张照片明显是AI生成的，你都没看出来，果然老了！😝",
        isMe: true,
        extraClass: "bad-msg-1",
      });
      setTimeout(
        () =>
          store.pushMessage({
            sender: "二大爷",
            text: "😡",
            extraClass: "bad-msg-1",
          }),
        3000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老爸",
            text: "😡",
            extraClass: "bad-msg-1",
          }),
        4000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "大堂哥",
            text: "😡",
            extraClass: "bad-msg-1",
          }),
        5000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            type: "sys",
            text: "你已被管理员移出该群",
            extraClass: "bad-msg-1",
          }),
        7000,
      );
      setTimeout(
        () => store.triggerHint("❌ 你被管理员移出“相亲相爱一家人”！"),
        8500,
      );
      setTimeout(
        () =>
          store.showResult(
            "fail",
            "闯关失败",
            "正确沟通也是数字素养的一部分！\n嘲讽长辈引发逆反心理，不仅达不到科普目的，反而会伤了和气。",
          ),
        12500,
      );
    } else if (val === "L1_B") {
      store.pushMessage({
        sender: "我",
        image: "/assets/img/signal_monster.jpg",
        type: "image",
        isMe: true,
      });
      setTimeout(
        () =>
          store.pushMessage({
            sender: "我",
            text: "二大爷，你看这张照片，大夏天我们南方出现雪山，广告牌的字缺胳膊少腿，不知所云，右下角还有AI生成字样，这是营销号用AI生成的图片，骗点击量的，别信。",
            isMe: true,
          }),
        1000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "二大爷",
            text: "😅 哎哟，现在这些公众号真缺德，我马上把它撤回来。",
          }),
        4000,
      );
      setTimeout(() => {
        store.hideMessageByKeyword("二大爷", "", true);
      }, 5500);
      setTimeout(() => {
        store.hideMessageByKeyword("二大爷", "震惊！漓江出现了变异巨兽");
      }, 7000);
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老爸",
            text: "AI生成的图片和真的一样，不细看都看不出来",
          }),
        8500,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "大堂哥",
            text: "学到了学到了，以后遇到反常理的图片要仔细看看，免得被蒙住了！",
          }),
        10000,
      );
      setTimeout(
        () => store.triggerHint("✅ 辟谣成功：有理有据，完美化解危机！"),
        12000,
      );
      setTimeout(() => {
        store.state.currentLevel = 2;
        store.playScript(GAME_STORY.level2_opening, () => {
          store.triggerHint("去看看三姑发的促销链接吧~", 2000);
          store.state.flaws.taobao.isOpen = true;
        });
      }, 14500);
    }
    // ----------- 第二关 -----------
    else if (val === "L2_A") {
      store.pushMessage({
        sender: "我",
        text: "三姑你是不是傻？天上能掉馅饼吗？这明显是骗取银行卡密码的网站！",
        isMe: true,
        extraClass: "bad-msg-2",
      });
      setTimeout(
        () =>
          store.pushMessage({
            sender: "三姑",
            text: "你这孩子怎么说话的？我好心分享，不领算了！",
            extraClass: "bad-msg-2",
          }),
        3000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            type: "sys",
            text: "5 分钟后...",
            extraClass: "bad-msg-2",
          }),
        5000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "三姑",
            text: "😭😭😭完了完了，我刚刚填了密码，卡里两万块钱被刷空了！",
            extraClass: "bad-msg-2",
          }),
        6500,
      );
      setTimeout(
        () =>
          store.showResult(
            "fail",
            "闯关失败",
            "言辞过激导致长辈逆反，没能及时阻断诈骗操作，造成了严重的经济损失！",
          ),
        8500,
      );
    } else if (val === "L2_B") {
      store.pushMessage({
        sender: "我",
        text: "三姑千万别填！你看这个网址后缀是.xyz，根本不是官方的。而且免费送东西还要索要银行卡密码，这是经典的邮费诈骗，填了钱就没了！",
        isMe: true,
      });
      setTimeout(
        () =>
          store.pushMessage({
            sender: "三姑",
            text: "哎哟我的妈呀！😱我正找老花镜准备输密码呢，多亏了你啊，我马上删！",
          }),
        4000,
      );
      setTimeout(
        () => store.hideMessageByKeyword("三姑", "taoobaoo-vip-free"),
        6000,
      );
      setTimeout(
        () => store.pushMessage({ sender: "三表姐", text: "幸好我还没填！😰" }),
        8000,
      );
      setTimeout(
        () =>
          store.pushMessage({ sender: "四表哥", text: "这个倒计时也是假的？" }),
        10000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "我",
            text: "没错！骗子常利用“限时限量”制造紧张感，越催越要冷静，冷静下来很容易看出破绽！",
            isMe: true,
          }),
        12000,
      );
      setTimeout(
        () => store.triggerHint("✅ 劝阻成功：保住了三姑的钱袋子！"),
        15000,
      );
      setTimeout(() => {
        store.state.currentLevel = 3;
        store.playScript(GAME_STORY.level3_opening, () => {
          store.triggerHint("去看看老妈发的视频会议链接吧~", 2000);
          store.state.flaws.facetime.isOpen = true;
        });
      }, 17500);
    }
    // ----------- 第三关 -----------
    else if (val === "L3_A") {
      store.pushMessage({
        sender: "我",
        text: "妈你别理她，这视频里的客服是 AI 换脸生成的，假的！这你都看不出来吗？🙄",
        isMe: true,
        extraClass: "bad-msg-3",
      });
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老妈",
            text: "嘿你这孩子，怎么可能假？人活生生在那说话呢！你别瞎说，我赶紧弄完，不然扣钱了！",
            extraClass: "bad-msg-3",
          }),
        3000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            type: "sys",
            text: "3 分钟后...",
            extraClass: "bad-msg-3",
          }),
        5000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老妈",
            text: "完了……我刚共享完屏幕，银行发短信说我卡里的定期全被转走了😭😭😭！",
            extraClass: "bad-msg-3",
          }),
        6500,
      );
      setTimeout(
        () =>
          store.showResult(
            "fail",
            "闯关失败",
            "未能及时阻断屏幕共享，导致核心隐私全部泄露。",
          ),
        8500,
      );
    } else if (val === "L3_B") {
      store.pushMessage({
        sender: "我",
        text: "妈！马上挂断！开飞行模式！官方人员不会通过非官方平台来联系你的！",
        isMe: true,
      });
      setTimeout(
        () =>
          store.pushMessage({
            sender: "我",
            text: "不管她看着多真，只要她要屏幕共享，100%是诈骗！",
            isMe: true,
          }),
        3000,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老妈",
            text: "哎呀！对对对，民警同志来小区宣传的时候讲过不能屏幕共享！我着急一下子忘了，我马上挂断拉黑！",
          }),
        5000,
      );
      setTimeout(() => store.hideMessageByKeyword("老妈", "视频会议"), 6500);
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老妈",
            text: "辖区的民警同志给我打电话了，刚刚那个果然是诈骗！",
          }),
        8500,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "大舅",
            text: "这骗术太高明了，换我我也觉得真有这么一回事",
          }),
        10500,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "二大爷",
            text: "以后遇到要求屏幕共享的，要警惕！",
          }),
        12500,
      );
      setTimeout(
        () => store.pushMessage({ sender: "老爸", text: "简直防不胜防！" }),
        14500,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老妈",
            text: "幸好没上当😌多亏了咱娃！",
          }),
        16500,
      );
      setTimeout(
        () =>
          store.pushMessage({
            sender: "老妈",
            text: "以后还是要多多学习，遇到这种事就能分辨出来了！🤭",
          }),
        18500,
      );
      setTimeout(
        () => store.triggerHint("✅ 极限救援成功：成功守住老妈的隐私和钱包！"),
        21500,
      );
      setTimeout(() => {
        store.showResult(
          "success",
          "🏆 完美通关！",
          "1. 细看漏洞：观察反常细节, 看图验证核实真相。\n2. 认准域名：警惕山寨网址，拒填密码，护好支付底线。\n3. 拒开共享：严防屏幕监控，切断转账，守住资金红线。",
        );
      }, 24000);
    }
  };

  return { handleChoice };
}
