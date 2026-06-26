<!--
  밥결사 메인 화면
-->
<template>
  <div class="bg-app">
    <div class="app">
      <!-- top bar -->
      <div class="topbar">
        <div class="logo">밥결사</div>
        <div class="loc"><span class="dot"></span>강남역 부근</div>
      </div>

      <!-- meal toggle -->
      <div class="toggle-wrap">
        <div class="toggle">
          <button :class="{ active: meal === 'lunch' }" @click="meal = 'lunch'">
            점심
          </button>
          <button
            :class="{ active: meal === 'dinner' }"
            @click="meal = 'dinner'"
          >
            저녁
          </button>
        </div>
      </div>

      <!-- pig + bubble -->
      <div class="pig-row">
        <div class="pig">
          <svg
            viewBox="0 0 120 120"
            width="100%"
            height="100%"
            style="display: block"
          >
            <path d="M32 40 Q26 18 44 30 Q42 40 36 46 Z" fill="#FF9FB5" />
            <path d="M88 40 Q94 18 76 30 Q78 40 84 46 Z" fill="#FF9FB5" />
            <circle cx="60" cy="64" r="36" fill="#FFB7C8" />
            <ellipse
              cx="38"
              cy="70"
              rx="8"
              ry="5.5"
              fill="#FF7E8A"
              opacity="0.35"
            />
            <ellipse
              cx="82"
              cy="70"
              rx="8"
              ry="5.5"
              fill="#FF7E8A"
              opacity="0.35"
            />
            <circle cx="48" cy="58" r="4.2" fill="#5A3D3D" />
            <circle cx="72" cy="58" r="4.2" fill="#5A3D3D" />
            <circle cx="49.4" cy="56.6" r="1.3" fill="#fff" />
            <circle cx="73.4" cy="56.6" r="1.3" fill="#fff" />
            <ellipse cx="60" cy="76" rx="16" ry="11" fill="#FF9DB4" />
            <ellipse cx="54" cy="76" rx="2.6" ry="3.6" fill="#C76B82" />
            <ellipse cx="66" cy="76" rx="2.6" ry="3.6" fill="#C76B82" />
            <path
              d="M99 28 l2.2 6.3 6.3 2.2 -6.3 2.2 -2.2 6.3 -2.2 -6.3 -6.3 -2.2 6.3 -2.2 Z"
              fill="#FFD27A"
            />
          </svg>
        </div>
        <div class="bubble">
          <div class="greet">{{ greet }}</div>
          <div class="say">이거 어때? 🍴</div>
        </div>
      </div>

      <!-- food card -->
      <div class="card-area">
        <div class="card-stack">
          <div class="card-back"></div>
          <div class="card-back2"></div>
          <div ref="cardEl" class="card" :class="flyClass">
            <div class="card-img" :style="{ background: cardBg }">
              <span class="img-note">음식 사진 들어갈 자리</span>
            </div>
            <div class="card-body">
              <div class="card-head">
                <div class="card-name">{{ menu.name }}</div>
                <div class="card-kcal">{{ menu.kcal }}</div>
              </div>
              <div class="tags">
                <span v-for="t in menu.tags" :key="t" class="tag">{{ t }}</span>
              </div>
              <div class="meta">
                <span class="pin">📍</span>
                <span class="rest">{{ menu.rest }}</span>
                <span class="sep">·</span>
                <span>{{ menu.dist }}</span>
                <span class="rate">★ {{ menu.rate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- actions -->
      <div class="actions">
        <button class="btn btn-pass" @click="act('pass')">✕</button>
        <button class="btn btn-undo" @click="undo">↺</button>
        <button class="btn btn-like" @click="act('like')">♥</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";

interface Menu {
  name: string;
  tags: string[];
  rest: string;
  dist: string;
  kcal: string;
  rate: string;
  tint: [string, string];
}

const MENUS: Menu[] = [
  {
    name: "김치찌개",
    tags: ["든든한", "얼큰한"],
    rest: "김치명가",
    dist: "320m",
    kcal: "520kcal",
    rate: "4.6",
    tint: ["#ffd9c2", "#ff9e7a"],
  },
  {
    name: "마라탕",
    tags: ["얼얼한", "중독성"],
    rest: "라화쿵부",
    dist: "450m",
    kcal: "610kcal",
    rate: "4.4",
    tint: ["#ffc9d6", "#e96b88"],
  },
  {
    name: "돈카츠",
    tags: ["바삭한", "든든한"],
    rest: "카츠야",
    dist: "280m",
    kcal: "780kcal",
    rate: "4.7",
    tint: ["#ffe2b0", "#f0a84e"],
  },
  {
    name: "크림파스타",
    tags: ["고소한", "부드러운"],
    rest: "파스타랩",
    dist: "410m",
    kcal: "690kcal",
    rate: "4.5",
    tint: ["#fff0cf", "#e9c46a"],
  },
  {
    name: "냉면",
    tags: ["시원한", "새콤한"],
    rest: "평양면옥",
    dist: "600m",
    kcal: "480kcal",
    rate: "4.3",
    tint: ["#d6f0ff", "#7ec8e3"],
  },
  {
    name: "제육덮밥",
    tags: ["매콤한", "밥도둑"],
    rest: "한솥도시락",
    dist: "150m",
    kcal: "730kcal",
    rate: "4.6",
    tint: ["#ffd0c0", "#ef6f53"],
  },
];

const i = ref(0);
const meal = ref<"lunch" | "dinner">("lunch");
const flyClass = ref("");
const busy = ref(false);
const cardEl = ref<HTMLElement | null>(null);

const menu = computed<Menu>(
  () => MENUS[((i.value % MENUS.length) + MENUS.length) % MENUS.length],
);
const greet = computed(() =>
  meal.value === "lunch" ? "꿀꿀… 오늘 점심은" : "꿀꿀… 오늘 저녁은",
);
const cardBg = computed(() => {
  const [a, b] = menu.value.tint;
  return `repeating-linear-gradient(135deg, ${a}, ${a} 16px, ${b}33 16px, ${b}33 32px), linear-gradient(150deg, ${a}, ${b})`;
});

async function act(dir: "like" | "pass") {
  if (busy.value) return;
  busy.value = true;
  flyClass.value = dir === "like" ? "fly-like" : "fly-pass";
  setTimeout(async () => {
    i.value = (i.value + 1) % MENUS.length;
    flyClass.value = "";
    // 등장 애니메이션 리셋 후 재생
    await nextTick();
    const el = cardEl.value;
    if (el) {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    }
    busy.value = false;
  }, 320);
}

function undo() {
  if (busy.value) return;
  i.value = (i.value - 1 + MENUS.length) % MENUS.length;
}
</script>

<style scoped lang="scss">
$cream: #fff6ef;
$pink: #ffb7c8;
$pink-soft: #ffeef3;
$pink-deep: #ff7e8a;
$ink: #5a3d3d;
$muted: #9a6b6b;
$tag-color: #c0708a;

* {
  box-sizing: border-box;
}

.bg-app {
  height: 100%;
  background: $cream;
  display: flex;
  justify-content: center;
  font-family: "Gowun Dodum", sans-serif;
}
.app {
  width: 100%;
  max-width: 430px;
  display: flex;
  flex-direction: column;
  position: relative;
  background: $cream;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px 26px 6px;
  .logo {
    font-family: "Jua", sans-serif;
    font-size: 23px;
    color: $pink-deep;
  }
  .loc {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1px solid #ffdbe3;
    border-radius: 999px;
    padding: 7px 13px;
    font-size: 12.5px;
    color: $muted;
    box-shadow: 0 4px 12px rgba(214, 140, 150, 0.14);
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: $pink-deep;
    }
  }
}

.toggle-wrap {
  padding: 8px 26px 0;
}
.toggle {
  display: inline-flex;
  background: #ffe7ee;
  border-radius: 999px;
  padding: 4px;
  gap: 2px;
  button {
    border: none;
    cursor: pointer;
    font-family: "Jua", sans-serif;
    font-size: 13.5px;
    padding: 8px 20px;
    border-radius: 999px;
    background: transparent;
    color: $tag-color;
    transition: 0.2s;
    &.active {
      background: #fff;
      color: $pink-deep;
      box-shadow: 0 3px 10px rgba(214, 140, 150, 0.2);
    }
  }
}

.pig-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 26px 6px;
  .pig {
    flex: 0 0 84px;
    height: 84px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 6px 16px rgba(214, 140, 150, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    animation: floaty 3.2s ease-in-out infinite;
  }
  .bubble {
    flex: 1;
    background: #fff;
    border: 1px solid #ffe3e9;
    border-radius: 20px 20px 20px 4px;
    padding: 14px 16px;
    box-shadow: 0 6px 16px rgba(214, 140, 150, 0.14);
    .greet {
      font-size: 12px;
      color: #c69;
      margin-bottom: 3px;
    }
    .say {
      font-family: "Jua", sans-serif;
      font-size: 17px;
      color: $ink;
    }
  }
}

.card-area {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 14px 26px 0;
  position: relative;
  min-height: 380px;
}
.card-stack {
  position: relative;
  width: 100%;
}
.card-back {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 18px;
  height: 330px;
  background: #ffe7ee;
  border-radius: 30px;
  transform: rotate(-3deg);
  z-index: 0;
}
.card-back2 {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 14px;
  height: 330px;
  background: #ffd9e3;
  border-radius: 30px;
  transform: rotate(2.4deg);
  z-index: 0;
}

.card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(214, 140, 150, 0.26);
  transition:
    transform 0.34s cubic-bezier(0.2, 0.7, 0.2, 1),
    opacity 0.34s;
  animation: popIn 0.36s ease both;
  &.fly-like {
    transform: translateX(440px) rotate(20deg);
    opacity: 0;
  }
  &.fly-pass {
    transform: translateX(-440px) rotate(-20deg);
    opacity: 0;
  }
}
.card-img {
  height: 212px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  .img-note {
    font-family: monospace;
    font-size: 10px;
    color: #fff;
    background: rgba(90, 61, 61, 0.32);
    padding: 4px 9px;
    border-radius: 8px;
  }
}
.card-body {
  padding: 18px 20px 22px;
}
.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.card-name {
  font-family: "Jua", sans-serif;
  font-size: 27px;
  color: $ink;
}
.card-kcal {
  font-size: 13px;
  color: $pink-deep;
  font-family: "Jua", sans-serif;
}

.tags {
  display: flex;
  gap: 7px;
  margin: 13px 0 16px;
  flex-wrap: wrap;
}
.tag {
  font-size: 12px;
  color: $tag-color;
  background: $pink-soft;
  border-radius: 999px;
  padding: 6px 12px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: $muted;
  font-size: 13.5px;
  .pin {
    display: inline-flex;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff0f4;
    align-items: center;
    justify-content: center;
    color: $pink-deep;
    font-size: 12px;
  }
  .rest {
    color: $ink;
  }
  .sep {
    color: #d9b3b3;
  }
  .rate {
    margin-left: auto;
    color: #e0a35a;
  }
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px 0 34px;
  .btn {
    border: none;
    cursor: pointer;
    border-radius: 50%;
    &:active {
      transform: scale(0.92);
    }
  }
  .btn-pass {
    width: 60px;
    height: 60px;
    background: #fff;
    color: #c99;
    font-size: 24px;
    box-shadow: 0 8px 20px rgba(214, 140, 150, 0.22);
  }
  .btn-undo {
    width: 48px;
    height: 48px;
    background: #fff4e6;
    color: #e0a35a;
    font-size: 17px;
    box-shadow: 0 6px 16px rgba(224, 163, 90, 0.2);
  }
  .btn-like {
    width: 72px;
    height: 72px;
    background: linear-gradient(150deg, #ff96a4, #ff7e8a);
    color: #fff;
    font-size: 30px;
    box-shadow: 0 10px 26px rgba(255, 126, 138, 0.5);
  }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes floaty {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
