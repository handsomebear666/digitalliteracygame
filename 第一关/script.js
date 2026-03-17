// ==========================================
// 0. 资源预加载逻辑 (必须放在最外层全局作用域)
// ==========================================
// 递归提取 ASSETS 对象里的所有图片 URL
function extractUrls(obj) {
  let urls = [];
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      urls.push(obj[key]); // 如果是字符串（路径），就存起来
    } else if (typeof obj[key] === "object") {
      urls = urls.concat(extractUrls(obj[key])); // 如果是嵌套对象，继续往里找
    }
  }
  return urls;
}

// 预加载所有图片，并返回一个 Promise
function preloadAllImages(assets) {
  const imageUrls = extractUrls(assets);
  let loadedCount = 0;

  return new Promise((resolve) => {
    if (imageUrls.length === 0) {
      resolve(); // 如果没有图片，直接完成
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      // 无论是加载成功还是失败，都算处理完了这一张
      img.onload = img.onerror = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          resolve(); // 所有图片都过了一遍，通知外部可以开始了
        }
      };
      img.src = url;
    });
  });
}

// ==========================================
// 加载静态图标功能
// ==========================================
function loadStaticAssets() {
  const mapping = {
    signal: ASSETS.ICONS.signal,
    wifi: ASSETS.ICONS.wifi,
    battery: ASSETS.ICONS.battery,
    back: ASSETS.ICONS.back,
    more: ASSETS.ICONS.more,
    voice_icon: ASSETS.ICONS.voice_icon,
    emoji_icon: ASSETS.ICONS.emoji_icon,
    plus_icon: ASSETS.ICONS.plus_icon,
    monster: ASSETS.IMAGES.monster,
  };

  for (let id in mapping) {
    const element = document.getElementById(id);
    if (element) {
      element.src = mapping[id];
    } else {
      console.error("找不到 ID 为 " + id + " 的图片标签！");
    }
  }
}

// ==========================================
// 动态时间刷新器 (让“刚刚”变成“X分钟前”)
// ==========================================
function refreshDynamicTimes() {
  const timeElements = document.querySelectorAll(".dynamic-time");
  timeElements.forEach((el) => {
    const ts = parseInt(el.getAttribute("data-timestamp"), 10);
    el.innerText = formatWeChatTime(ts);
  });
}
// 设定每 60 秒自动刷新一次所有时间
setInterval(refreshDynamicTimes, 60000);

// ==========================================
// 1. 时间显示逻辑
// ==========================================
function updateTime() {
  const now = new Date();
  document.getElementById("clock").innerText =
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}
setInterval(updateTime, 1000);
updateTime();

// ... 后面的 function formatWeChatTime(timestamp) { ... 等保持完全不变！

function formatWeChatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = (now - date) / 1000;
  const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return Math.floor(diff / 60) + " 分钟前";
  if (date.toDateString() === now.toDateString()) return timeStr;
  return "昨天 " + timeStr;
}

function addTimeDivider(timestamp) {
  const chatBox = document.getElementById("chatBox");
  const timeDiv = document.createElement("div");
  timeDiv.className = "sys-msg";
  // 将传入的时间统一转换为毫秒时间戳
  const timeValue = timestamp instanceof Date ? timestamp.getTime() : timestamp;

  // 【关键】：加上 dynamic-time 类名和 data-timestamp 属性
  timeDiv.innerHTML = `<span class="dynamic-time" data-timestamp="${timeValue}">${formatWeChatTime(timeValue)}</span>`;
  chatBox.appendChild(timeDiv);
}

// ==========================================
// 2. 核心：发消息功能
// ==========================================
// avatarKey 对应 story.js 里的 "uncle", "aunt"
function addMessage(sender, text, isMe, avatarKey) {
  const chatBox = document.getElementById("chatBox");
  const row = document.createElement("div");

  // 自动去 ASSETS 里找头像，找不到就用默认的
  const realImagePath = ASSETS.AVATARS[avatarKey] || "img/default.png";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "avatar";
  const img = document.createElement("img");
  img.src = realImagePath;
  avatarDiv.appendChild(img);

  const content = document.createElement("div");
  content.className = "msg-content";
  content.innerText = text;

  if (isMe) {
    row.className = "msg-row msg-right";
    row.appendChild(content);
    row.appendChild(avatarDiv);
  } else {
    row.className = "msg-row msg-left";
    row.appendChild(avatarDiv);

    // 【新增逻辑】：创建一个包裹层，用来上下排列“名字”和“气泡”
    const msgWrapper = document.createElement("div");
    msgWrapper.className = "msg-wrapper";

    // 创建名字标签
    const nameDiv = document.createElement("div");
    nameDiv.className = "msg-name";
    nameDiv.innerText = sender; // 读取传入的 sender (如"二大爷")

    // 将名字和气泡塞进包裹层
    msgWrapper.appendChild(nameDiv);
    msgWrapper.appendChild(content);

    // 将包裹层放入当前行
    row.appendChild(msgWrapper);
  }

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==========================================
// 3. 剧情流程控制
// ==========================================
// 网页一加载就开始表演
window.onload = function () {
  // 此时屏幕还是黑的，或者只有背景色
  console.log("正在拼命加载图片资源...");

  // 开始预加载，加载完成后执行 .then 里面的逻辑
  preloadAllImages(ASSETS).then(() => {
    console.log("资源加载完毕，游戏正式开始！");

    loadStaticAssets();
    addTimeDivider(new Date());

    // 智能读取 story.js 里的开场数据
    GAME_STORY.openingimage.forEach((item) => {
      setTimeout(() => {
        addImageMessage(item.sender, item.image, false, item.avatar);
      }, item.delay);
    });
    GAME_STORY.openingtext.forEach((item) => {
      setTimeout(() => {
        addMessage(item.sender, item.text, false, item.avatar);
      }, item.delay);
    });

    // 4.5秒后（长辈们发完话了），触发警告弹窗
    setTimeout(() => {
      triggerMissionAlert();
    }, 8000);
  });
};

// 触发警告
function triggerMissionAlert() {
  const overlay = document.getElementById("missionOverlay");
  overlay.style.display = "flex";
  setTimeout(typeWriter, 300);
}

// 打字机特效 (读取 story.js 里的文字)
let typeIndex = 0;
function typeWriter() {
  const text = GAME_STORY.warningText;
  if (typeIndex < text.length) {
    document.getElementById("typedText").innerHTML += text.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeWriter, 60);
  } else {
    const btn = document.getElementById("startBtn");
    btn.style.transition = "opacity 0.5s ease";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  }
}

// 玩家点击接受任务
function startGame() {
  const overlay = document.getElementById("missionOverlay");
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
    nextStep(1); // 正式进入第一关！
  }, 500);
}

// 关卡交互逻辑
function nextStep(step) {
  const actionArea = document.getElementById("actionArea");

  if (step === 1) {
    // 清空底部操作区（因为我们现在用上方弹出的 Toast 了）
    actionArea.innerHTML = "";

    updateSystemHint(
      "造假者往往忽略环境常识。请点击放大图片寻找破绽。",
      true,
      1500,
    );

    canFindFlaws = true;
  }
}

// ==========================================
// 1. 发送图片消息的功能
// ==========================================
function addImageMessage(sender, imageSrc, isMe, avatarKey) {
  const chatBox = document.getElementById("chatBox");
  const row = document.createElement("div");
  const realAvatarPath = ASSETS.AVATARS[avatarKey] || "img/default.png";

  const avatarDiv = document.createElement("div");
  avatarDiv.className = "avatar";
  avatarDiv.innerHTML = `<img src="${realAvatarPath}" />`;

  const content = document.createElement("div");
  // 【关键修改】：在这里加上 no-tail 类名
  content.className = "msg-content no-tail";
  content.style.padding = "0"; // 图片不需要内边距
  content.style.backgroundColor = "transparent"; // 移除背景色

  // 图片标签，绑定点击事件打开放大取证界面
  content.innerHTML = `<img src="${imageSrc}" class="msg-image" onclick="openInspector('${imageSrc}')" />`;

  if (isMe) {
    row.className = "msg-row msg-right";
    row.appendChild(content);
    row.appendChild(avatarDiv);
  } else {
    row.className = "msg-row msg-left";
    row.appendChild(avatarDiv);

    const msgWrapper = document.createElement("div");
    msgWrapper.className = "msg-wrapper";

    const nameDiv = document.createElement("div");
    nameDiv.className = "msg-name";
    nameDiv.innerText = sender;

    msgWrapper.appendChild(nameDiv);
    msgWrapper.appendChild(content);
    row.appendChild(msgWrapper);
  }

  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ==========================================
// 2. 动态打字机 Toast 提示 (阅后即焚版)
// ==========================================
let currentHintContent = ""; // 记忆当前的提示词，供玩家点击按钮重看
let toastTimeout = null; // 计时器

// 更新并立刻弹出提示
function updateSystemHint(text, showBtn = true, duration = 2000) {
  currentHintContent = text;

  const hintBtn = document.getElementById("inlineHintBtn");
  if (hintBtn) {
    // 根据传入的参数决定是否显示按钮
    hintBtn.style.display = showBtn ? "block" : "none";
  }

  showToast(text, duration);
}

// 玩家点击“💡 提示”按钮时触发
function triggerCurrentHint() {
  if (currentHintContent) {
    showToast(currentHintContent);
  }
}

// 内部函数：控制弹窗的直接显示与自动消失 (干脆利落版)
function showToast(text, duration = 2000) {
  const toast = document.getElementById("systemToast");
  const textContainer = document.getElementById("toastText");

  // 如果当前有正在执行的消失倒计时，先取消掉，防止频繁点击导致闪烁
  if (toastTimeout) clearTimeout(toastTimeout);

  // 直接填入文字并显示
  textContainer.innerHTML = text;
  toast.classList.add("show");

  // 设定 1.5 秒后自动消失
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

// ==========================================
// 3. 图片放大与找茬取证逻辑
// ==========================================
let foundFlaws = 0; // 记录找到了几个破绽
// 【新增】：剧情锁，控制什么时候允许找破绽
let canFindFlaws = false;

function openInspector(imageSrc) {
  const inspector = document.getElementById("imageInspector");
  const img = document.getElementById("inspectorImg");
  img.src = imageSrc;
  inspector.style.display = "flex";
}

function closeInspector() {
  document.getElementById("imageInspector").style.display = "none";
}

function revealFlaw(flawId) {
  // 【新增拦截逻辑】：如果还没到找破绽的环节（锁没开），直接退出，不执行后续逻辑
  if (!canFindFlaws) return;

  const hotspot = document.getElementById(`flaw-${flawId}`);

  if (!hotspot.classList.contains("revealed")) {
    hotspot.classList.add("revealed");
    foundFlaws++;

    // 根据发现的不同破绽，即时修改胶囊里的提示词
    if (flawId === "mountain") {
      updateSystemHint("发现破绽：南方水库背景不应出现雪山！", true, 1000);
    } else if (flawId === "billboard") {
      updateSystemHint("发现破绽：广告牌文字扭曲，典型AI幻觉。", true, 1000);
    } else if (flawId === "ai") {
      updateSystemHint("发现破绽：检测到角落隐藏的AI创作水印。", true, 1000);
    }

    // 找齐后的逻辑
    if (foundFlaws === 3) {
      // 1. 立即隐藏提示按钮，防止在结算动画时干扰玩家
      const hintBtn = document.getElementById("inlineHintBtn");
      if (hintBtn) {
        hintBtn.style.display = "none";
      }
      setTimeout(() => {
        closeInspector();
        updateSystemHint("证据搜集完毕！请选择最有效的辟谣方式。", false, 1000);
        // 延迟 1.5 秒后显示底部选项
        setTimeout(showDebunkOptions, 1500);
      }, 1200);
    }
  }
}

// ==========================================
// 更新：显示辟谣选项 (带抽屉背景版)
// ==========================================
function showDebunkOptions() {
  // 【新增】：呼出选项时，让整个屏幕背景变暗模糊
  document.getElementById("drawerOverlay").classList.add("show");

  const actionArea = document.getElementById("actionArea");
  actionArea.innerHTML = `
    <div class="options-panel">
      <div class="question-title">你需要在群里回复二大爷，你选择：</div>
      
      <button class="action-btn outline" onclick="chooseOption('A')">
        嘲笑二大爷
      </button>
      
      <button class="action-btn solid" onclick="chooseOption('B')">
        告知二大爷这张图是假的
      </button>
    </div>
  `;
}

// ==========================================
// 1. 处理玩家的选择 (增强版：分步撤回与踢人)
// ==========================================
function chooseOption(choice) {
  // 【新增】：选完选项后，撤掉模糊背景
  document.getElementById("drawerOverlay").classList.remove("show");

  const actionArea = document.getElementById("actionArea");
  actionArea.innerHTML = ""; // 选完后立刻清空底部按钮

  if (choice === "A") {
    // 【坏结局分支：嘲讽二大爷】
    setTimeout(() => {
      addMessage(
        "我",
        "二大爷你可长点心吧，哈哈哈哈这张照片明显是AI生成的，你都没看出来，果然老了！",
        true,
        "me",
      );
    }, 1500);

    setTimeout(() => {
      addMessage("二大爷", "😡", false, "uncle");
    }, 3000);
    setTimeout(() => {
      addMessage("二大爷", "😡", false, "uncle");
    }, 4000);
    setTimeout(() => {
      addMessage("二大爷", "😡", false, "uncle");
    }, 5000);

    setTimeout(() => {
      // 1. 修改群人数：27 -> 26
      const groupNameDiv = document.getElementById("groupName");
      if (groupNameDiv) groupNameDiv.innerText = "相亲相爱一家人 (26)";

      // 2. 打印踢出提示
      addSystemMessage("你已被管理员移出该群");
    }, 7000);
    setTimeout(() => {
      // 3. 弹出失败提示
      updateSystemHint(
        "❌ 辟谣失败：嘲讽长辈引发逆反心理。沟通也是数字素养的一部分！刷新页面重试。",
        false,
      );
    }, 9000);
  } else if (choice === "B") {
    // 【好结局分支：高情商科普】
    addImageMessage("我", "assets/signalmonster.png", true, "me");
    setTimeout(() => {
      addMessage(
        "我",
        "二大爷，你看这张照片，大夏天我们南方出现雪山，广告牌的字缺胳膊少腿，不知所云，右下角还有AI生成字样，这是营销号用AI生成的图片，骗点击量的，别信。",
        true,
        "me",
      );
    }, 2000);

    setTimeout(() => {
      addMessage(
        "二大爷",
        "😅 哎哟，现在这些公众号真缺德，我马上把它撤回来。",
        false,
        "uncle",
      );
    }, 4000);

    // 【关键修改：分步骤撤回动作】
    // 动作 1：过 1.5 秒后，先撤回“图片”
    setTimeout(() => {
      hideUncleMessage("image"); // 精准隐藏图片
      addSystemMessage("二大爷撤回了一条消息");
    }, 5500);

    // 动作 2：再过 1.5 秒后，撤回“文字”
    setTimeout(() => {
      hideUncleMessage("text"); // 精准隐藏文字
      addSystemMessage("二大爷撤回了一条消息");
    }, 7000);
    setTimeout(() => {
      // 弹出成功提示
      updateSystemHint(
        "✅ 辟谣成功：有理有据且顾及长辈面子，完美化解危机！",
        false,
      );
    }, 9000);
  }
}

// ==========================================
// 2. 精准隐藏消息工具 (区分图片和文字)
// ==========================================
function hideUncleMessage(type) {
  const rows = document.querySelectorAll(".msg-row");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.style.display === "none") continue; // 已经隐藏的跳过

    if (type === "image") {
      // 寻找：包含二大爷名字，且里面有 .msg-image 图片的行
      const hasImage = row.querySelector(".msg-image");
      const isUncle = row.innerText.includes("二大爷");
      if (hasImage && isUncle) {
        row.style.display = "none";
        return; // 删掉图片就结束本次任务
      }
    } else if (type === "text") {
      // 寻找：包含特定谣言文字的行
      if (row.innerText.includes("震惊！咱们本地捞出变异巨兽")) {
        row.style.display = "none";
        return; // 删掉文字就结束本次任务
      }
    }
  }
}

// ==========================================
// 3. 微信系统灰色提示消息 (撤回/移出群聊专用)
// ==========================================
// ⚠️ 注意：这个函数必须保留，否则上面的逻辑会报错中断！
function addSystemMessage(text) {
  const chatBox = document.getElementById("chatBox");
  const sysDiv = document.createElement("div");
  sysDiv.className = "sys-msg";
  // 增加一点上下间距，避免挤在一起
  sysDiv.style.margin = "10px 0";
  sysDiv.innerHTML = `<span>${text}</span>`;
  chatBox.appendChild(sysDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
