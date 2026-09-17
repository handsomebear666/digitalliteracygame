// game2 手机模拟器 8 个页面的 HTML 渲染函数
// 对应原 src/views/games/game2/components/phone/*.vue
// 依赖 js/game2/assets.js、js/game2/story.js（先于本文件加载）
const escP = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// 群聊设置页的开关状态（原 GroupDetail.vue 的 reactive settings）
function createGroupSettings() {
  return {
    muteNotif: true,
    collapseChat: false,
    stickyTop: false,
    saveContact: false,
    showMemberName: true,
  };
}

// ------------------------------------------------------------------
// 1. 微信群聊（WechatChat.vue）
// ------------------------------------------------------------------
function wechatChatHtml() {
  const messages = GAME_STORY.ownerGroupMessages
    .map((msg) => {
      if (msg.type === "oa_card") {
        return `
        <div class="message-item">
          <img src="${ASSETS.AVATARS[msg.avatar]}" class="avatar" data-action="handle-avatar" alt="" />
          <div class="content-area">
            <div class="sender-name">${escP(msg.sender)}</div>
            <div class="fake-oa-card" data-action="nav" data-page="oa-profile">
              <div class="oa-card-body">
                <div class="oa-card-logo"><img src="${ASSETS.IMAGES.oa_icon}" alt="" /></div>
                <div class="oa-card-name">${escP(msg.oaName)}</div>
              </div>
              <div class="oa-card-footer">${escP(msg.oaDesc)}</div>
            </div>
          </div>
        </div>`;
      }
      return `
        <div class="message-item">
          <img src="${ASSETS.AVATARS[msg.avatar]}" class="avatar" data-action="handle-avatar" alt="" />
          <div class="content-area">
            <div class="sender-name">${escP(msg.sender)}</div>
            <div class="text-bubble">${escP(msg.content)}</div>
          </div>
        </div>`;
    })
    .join("");

  return `
    <div class="wechat-page page-wechat-chat">
      <div class="wechat-header">
        <div class="wechat-header-left" data-action="return-to-dialogue">
          <img src="${ASSETS.ICONS.icon_back}" class="header-icon icon-back" alt="" />
        </div>
        <div class="wechat-header-title">幸福家园业主群 (492)</div>
        <div class="wechat-header-right" data-action="nav" data-page="group-detail">
          <img src="${ASSETS.ICONS.icon_dots}" class="header-icon icon-dots" alt="" />
        </div>
      </div>

      <div class="chat-container">
        <div class="time-divider"><span>半小时前</span></div>
        ${messages}
      </div>

      <div class="wechat-bottom-bar">
        <img src="${ASSETS.ICONS.icon_voice}" class="bottom-icon" alt="" />
        <div class="wechat-input-box"></div>
        <img src="${ASSETS.ICONS.icon_emoji}" class="bottom-icon" alt="" />
        <img src="${ASSETS.ICONS.icon_plus}" class="bottom-icon" alt="" />
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 2. 公众号主页 / 资料页（OfficialAccount.vue）
// ------------------------------------------------------------------
function officialAccountHtml(state) {
  if (state.activePhonePage === "oa-about") {
    return `
    <div class="wechat-page page-official-account" style="background: #f7f7f7">
      <div style="height: 100%; display: flex; flex-direction: column">
        <div class="wechat-header" style="background: #ffffff">
          <div class="wechat-header-left" data-action="nav" data-page="oa-profile">
            <img src="${ASSETS.ICONS.icon_close}" class="header-icon icon-close" style="filter: brightness(0)" alt="" />
          </div>
          <div class="wechat-header-title"></div>
          <div class="wechat-header-right"></div>
        </div>
        <div class="oa-about-content">
          <div class="about-section">
            <div class="about-title">公众号简介</div>
            <div class="about-text">您好，XX市图书馆欢迎您的关注~</div>
          </div>
          <div class="about-section">
            <div class="about-title">基础信息</div>
            <div class="about-row">
              <span>微信号</span><span class="val">tsg_hd_888</span>
            </div>
            <div class="about-row flaw-row ${state.foundFlawsL1.includes("subject") ? "flaw-exposed" : ""}" data-action="l1" data-type="subject">
              <span>主体类型</span><span class="val" style="color: #333; font-weight: bold">个人</span>
            </div>
            <div class="about-row">
              <span>IP 属地</span><span class="val" style="color: #999">山东</span>
            </div>
          </div>
          <div class="about-section">
            <div class="about-title">名称记录</div>
            <div class="about-text" style="color: #666; font-size: 14px; margin-top: 10px">
              2026 年 03 月 01 日“爱分享的小张”改名“XX市市图书管活动中心”
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // oa-profile
  return `
    <div class="wechat-page page-official-account" style="background: #f7f7f7">
      <div style="height: 100%; display: flex; flex-direction: column">
        <div class="wechat-header" style="background: #ffffff; border-bottom: none">
          <div class="wechat-header-left" data-action="nav" data-page="chat">
            <img src="${ASSETS.ICONS.icon_back}" class="header-icon icon-back" style="filter: brightness(0)" alt="" />
          </div>
          <div class="wechat-header-right">
            <img src="${ASSETS.ICONS.icon_dots}" class="header-icon icon-dots" style="filter: brightness(0)" alt="" />
          </div>
        </div>

        <div class="oa-profile-content">
          <div class="oa-top-section">
            <div class="oa-basic-info">
              <img src="${ASSETS.IMAGES.oa_icon}" class="oa-round-logo" alt="" />
              <div class="oa-titles flaw-row ${state.foundFlawsL1.includes("typo") ? "flaw-exposed" : ""}" data-action="l1" data-type="typo">
                <div class="oa-name">XX市图书管活动中心</div>
                <div class="oa-sub">山东</div>
              </div>
            </div>

            <div class="oa-share-row" data-action="nav" data-page="oa-about">
              <span>您好，XX市图书馆欢迎您的关注~</span><span class="oa-arrow">></span>
            </div>

            <div class="oa-actions">
              <button class="oa-btn">已关注公众号</button>
              <button class="oa-btn">私信</button>
            </div>

            <div class="oa-tabs">
              <span class="active">全部</span>
              <span>贴图</span>
              <span>视频</span>
              <span>服务</span>
            </div>
          </div>

          <div class="oa-posts-container">
            <div class="oa-post-card flaw-row ${state.foundFlawsL1.includes("history") ? "flaw-exposed" : ""}" data-action="l1" data-type="history">
              <div class="post-date">今天</div>
              <div class="post-content-row">
                <div class="post-text-col">
                  <div class="post-title">
                    【官方认证】建馆 30 周年，50 元话费与好礼限时领！
                  </div>
                  <div class="post-meta">阅读 269 &nbsp; 赞 11</div>
                </div>
                <div class="post-img-col">
                  <img src="${ASSETS.IMAGES.post_cover}" onerror="this.src = ''" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 3. 钓鱼网页表单（PhishingForm.vue）
// ------------------------------------------------------------------
function phishingFormHtml() {
  return `
    <div class="wechat-page page-phishing-form" style="background: #f5f5f5; z-index: 100">
      <div class="wechat-header" style="background: #ffffff">
        <div class="wechat-header-left" data-action="return-to-dialogue">
          <img src="${ASSETS.ICONS.icon_close}" class="header-icon icon-close" style="filter: brightness(0)" alt="" />
        </div>
        <div class="wechat-header-title" style="font-size: 16px">
          三十周年回馈活动
        </div>
        <div class="wechat-header-right">
          <img src="${ASSETS.ICONS.icon_dots}" class="header-icon icon-dots" style="filter: brightness(0)" alt="" />
        </div>
      </div>
      <div class="welfare-banner">
        <h2>🎁 倾情回馈 免费领取</h2>
        <p>50 元话费 + 高级抽纸一箱</p>
      </div>
      <div class="welfare-form">
        <div class="form-title">请填写收货与充值信息</div>
        <input type="text" class="welfare-input" value="幸福小区 3 栋 2 单元 501" readonly />
        <input type="text" class="welfare-input" value="138****5678" readonly />
        <div class="code-group">
          <input type="text" class="welfare-input code-input" id="verification-code" placeholder="请输入短信验证码" />
          <button class="get-code-btn" data-action="toast" data-message="验证码已发送，请注意查收！">
            重新获取 (59s)
          </button>
        </div>
        <button class="submit-welfare-btn" data-action="welfare-submit">
          立即免费领取
        </button>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 4. 假冒张大姐资料页（ProfileFake.vue）
// ------------------------------------------------------------------
function profileFakeHtml(state) {
  return `
    <div class="wechat-page page-profile-fake" style="background: #ededed; z-index: 100">
      <div class="wechat-header" style="background: #ffffff; border-bottom: none">
        <div class="wechat-header-left" data-action="nav" data-page="chat">
          <img src="${ASSETS.ICONS.icon_back}" class="header-icon icon-back" style="filter: brightness(0)" alt="" />
        </div>
        <div class="wechat-header-right" data-action="open-action-sheet">
          <img src="${ASSETS.ICONS.icon_dots}" class="header-icon icon-dots" style="filter: brightness(0)" alt="" />
        </div>
      </div>

      <div class="profile-top-card flaw-row ${state.foundFlawsL3.includes("info") ? "flaw-exposed" : ""}" data-action="l3" data-type="info">
        <img src="${ASSETS.AVATARS.aunt_zhang}" class="profile-avatar" alt="" />
        <div class="profile-info">
          <div class="profile-name">张大姐</div>
          <div class="profile-sub">微信号：wxid_987654321</div>
          <div class="profile-sub">地区：安道尔</div>
        </div>
      </div>

      <div class="profile-row-card flaw-row" data-action="nav" data-page="fake-moments">
        <span class="row-label">朋友圈</span>
        <span class="row-content" style="color: #999; font-size: 13px">[广告] 惊天福利...</span>
        <span class="row-arrow">></span>
      </div>

      <div class="profile-row-card">
        <span class="row-label">更多信息</span><span class="row-arrow">></span>
      </div>

      <div class="profile-btn-card flaw-row ${state.foundFlawsL3.includes("add") ? "flaw-exposed" : ""}" data-action="l3" data-type="add">
        <div class="profile-btn-green">添加到通讯录</div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 5. 真正的张大姐资料页（ProfileReal.vue）
// ------------------------------------------------------------------
function profileRealHtml(state) {
  return `
    <div class="wechat-page page-profile-real">
      <div class="wechat-header">
        <div class="wechat-header-left" data-action="nav" data-page="search">
          <img src="${ASSETS.ICONS.icon_back}" class="header-icon icon-back" alt="" />
        </div>
        <div class="wechat-header-right">
          <i class="fas fa-ellipsis-h header-icon icon-menu"></i>
        </div>
      </div>

      <div class="profile-top-card flaw-row ${state.foundFlawsL3.includes("auntZhangProfile") ? "flaw-exposed" : ""}" data-action="l3" data-type="auntZhangProfile">
        <img src="${ASSETS.AVATARS.aunt_zhang}" class="profile-avatar" alt="" />
        <div class="profile-info">
          <div class="profile-name">
            张大姐
            <i class="fas fa-female gender-icon-pink"></i>
          </div>
          <div class="profile-sub">昵称：张翠芳</div>
          <div class="profile-sub">微信号：zhang_cf888</div>
          <div class="profile-sub">地区：广西桂林</div>
        </div>
      </div>

      <div class="profile-memo-card" data-action="nav" data-page="memo_details">
        <div class="memo-title-row">
          <span class="row-label">朋友资料</span>
          <span class="row-arrow">></span>
        </div>
        <div class="memo-desc-row">
          添加朋友的备注名、电话、标签、备忘、照片等，并设置朋友权限。
        </div>
      </div>

      <div class="profile-row-card moment-card" data-action="nav" data-page="moment">
        <span class="row-label">朋友圈</span>
        <span class="row-arrow">></span>
      </div>

      <div class="action-card">
        <div class="action-btn border-bottom">
          <img src="${ASSETS.ICONS.icon_message}" class="action-icon" alt="" />
          发消息
        </div>
        <div class="action-btn">
          <img src="${ASSETS.ICONS.icon_video_call}" class="action-icon" alt="" />
          音视频通话
        </div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 6. 假冒朋友圈（FakeMoments.vue）
// ------------------------------------------------------------------
function fakeMomentsHtml(state) {
  return `
    <div class="wechat-page page-fake-moments" style="background: #ffffff; z-index: 105">
      <div class="wechat-header" style="background: transparent; position: absolute; border: none; z-index: 106">
        <div class="wechat-header-left" data-action="nav" data-page="fake-profile">
          <img src="${ASSETS.ICONS.icon_back}" class="header-icon icon-back" alt="" />
        </div>
      </div>
      <div class="moments-cover" style="background: #333"></div>
      <div class="moments-user">
        <span class="m-name">张大姐</span>
        <img src="${ASSETS.AVATARS.aunt_zhang}" class="m-avatar" alt="" />
      </div>
      <div class="moments-body">
        <div class="post-group flaw-row ${state.foundFlawsL3.includes("moments") ? "flaw-exposed" : ""}" data-action="l3" data-type="moments">
          <div class="post-date">
            <span class="day">昨天</span>
          </div>

          <div class="post-card">
            <div class="post-text-content">
              <div class="post-title">
                建馆 30 周年大回馈，点击链接免费领 50 元话费 + 纸巾！👉
                <span class="highlight-link">http://fake-welfare-phishing.com</span>
              </div>

              <div class="comment-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 7. 群聊信息页（GroupDetail.vue）
// ------------------------------------------------------------------
function groupDetailHtml(settings) {
  const members = Array.from({ length: 19 })
    .map(
      (_, i) => `
        <div class="member-item">
          <div class="member-avatar placeholder-avatar"></div>
          <div class="member-name">成员${i + 1}</div>
        </div>`,
    )
    .join("");

  const switchCls = (key) =>
    settings[key] ? "ios-switch active" : "ios-switch";

  return `
    <div class="wechat-page page-group-detail">
      <div class="wechat-header">
        <div class="header-left" data-action="nav" data-page="chat">
          <img src="${ASSETS.ICONS.icon_back}" class="svg-icon icon-back" alt="back" />
        </div>
        <div class="header-title">
          聊天信息(492)
        </div>
        <div class="header-right" data-action="nav" data-page="search">
          <img src="${ASSETS.ICONS.icon_search}" class="svg-icon icon-search" alt="search" />
        </div>
      </div>

      <div class="page-content">
        <div class="section members-section">
          <div class="members-grid">
            ${members}
            <div class="member-item">
              <div class="member-avatar add-btn">
                <div class="add-icon"></div>
              </div>
              <div class="member-name"></div>
            </div>
          </div>
          <div class="more-members-btn">
            更多群成员 <span class="arrow-down"></span>
          </div>
        </div>

        <div class="section">
          <div class="list-item">
            <span class="item-label">群聊名称</span>
            <div class="item-value-wrap">
              <span class="item-value truncate-text">幸福家园业主群</span>
              <span class="arrow-right"></span>
            </div>
          </div>
          <div class="list-item">
            <span class="item-label">群二维码</span>
            <div class="item-value-wrap">
              <img src="${ASSETS.ICONS.icon_qrcode}" class="svg-icon icon-qrcode" alt="qr" />
              <span class="arrow-right"></span>
            </div>
          </div>
          <div class="list-item notice-item">
            <div class="notice-header">
              <span class="item-label">群公告</span>
              <span class="arrow-right"></span>
            </div>
            <div class="notice-content truncate-text-2"></div>
          </div>
          <div class="list-item no-border">
            <span class="item-label">备注</span>
            <span class="arrow-right"></span>
          </div>
        </div>

        <div class="section">
          <div class="list-item no-border">
            <span class="item-label">查找聊天记录</span>
            <span class="arrow-right"></span>
          </div>
        </div>

        <div class="section">
          <div class="list-item">
            <span class="item-label">消息免打扰</span>
            <div class="${switchCls("muteNotif")}" data-action="group-toggle" data-key="muteNotif"></div>
          </div>
          <div class="list-item">
            <span class="item-label">折叠该群聊</span>
            <div class="${switchCls("collapseChat")}" data-action="group-toggle" data-key="collapseChat"></div>
          </div>
          <div class="list-item double-line-item">
            <div class="item-text-col">
              <span class="item-label">以下消息仍通知</span>
              <span class="item-sub-label">@我，@所有人和群公告</span>
            </div>
            <span class="arrow-right"></span>
          </div>
          <div class="list-item">
            <span class="item-label">置顶聊天</span>
            <div class="${switchCls("stickyTop")}" data-action="group-toggle" data-key="stickyTop"></div>
          </div>
          <div class="list-item no-border">
            <span class="item-label">保存到通讯录</span>
            <div class="${switchCls("saveContact")}" data-action="group-toggle" data-key="saveContact"></div>
          </div>
        </div>

        <div class="section">
          <div class="list-item">
            <span class="item-label">我在群里的昵称</span>
            <span class="arrow-right"></span>
          </div>
          <div class="list-item no-border">
            <span class="item-label">显示群成员昵称</span>
            <div class="${switchCls("showMemberName")}" data-action="group-toggle" data-key="showMemberName"></div>
          </div>
        </div>

        <div class="section">
          <div class="list-item">
            <span class="item-label">设置当前聊天背景</span>
            <span class="arrow-right"></span>
          </div>
          <div class="list-item">
            <span class="item-label">清空聊天记录</span>
            <span class="arrow-right"></span>
          </div>
          <div class="list-item no-border">
            <span class="item-label">投诉</span>
            <span class="arrow-right"></span>
          </div>
        </div>

        <div class="section action-section">
          <div class="danger-btn">退出群聊</div>
        </div>

        <div class="bottom-spacer"></div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 8. 群成员搜索页（GroupSearch.vue）
// ------------------------------------------------------------------
function groupSearchHtml(state) {
  return `
    <div class="wechat-page page-group-search">
      <div class="search-header">
        <div class="search-bar-wrap">
          <img src="${ASSETS.ICONS.icon_search}" class="search-icon" alt="" />
          <input type="text" class="search-input" value="张大姐" readonly />
        </div>
        <div class="search-back" data-action="nav" data-page="group-detail">
          取消
        </div>
      </div>

      <div class="search-list">
        <div class="search-result-item" data-action="toast" data-message="你刚刚看过了，这是个假冒的！">
          <img src="${ASSETS.AVATARS.aunt_zhang}" class="search-avatar" alt="" />
          <div class="search-info">
            <div class="s-name"><span class="highlight">张</span>大姐</div>
            <div class="s-sub">昵称：<span class="highlight">张</span>大姐</div>
          </div>
        </div>

        <div class="search-result-item flaw-row ${state.foundFlawsL3.includes("real") ? "flaw-exposed" : ""}" data-action="l3" data-type="real">
          <img src="${ASSETS.AVATARS.aunt_zhang}" class="search-avatar" alt="" />
          <div class="search-info">
            <div class="s-name"><span class="highlight">张</span>大姐</div>
            <div class="s-sub">群昵称：<span class="highlight">张</span>大姐</div>
          </div>
        </div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------
// 路由：根据当前激活页面返回对应 HTML
// ------------------------------------------------------------------
function phonePageHtml(page, state, settings) {
  switch (page) {
    case "chat":
      return wechatChatHtml();
    case "oa-profile":
    case "oa-about":
      return officialAccountHtml(state);
    case "welfare":
      return phishingFormHtml();
    case "fake-profile":
      return profileFakeHtml(state);
    case "real-profile":
      return profileRealHtml(state);
    case "fake-moments":
      return fakeMomentsHtml(state);
    case "group-detail":
      return groupDetailHtml(settings);
    case "search":
      return groupSearchHtml(state);
    default:
      return "";
  }
}
