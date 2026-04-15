<template>
  <div class="about-page">
    <!-- 主要內容區 -->
    <main class="about-main">
      <!-- Logo -->
      <div class="about-logo">
        <img src="/logo_2.png" alt="小紅帽科技" />
      </div>

      <!-- 我們的初衷 -->
      <section class="intro-section">
        <h1 class="section-title">我們的初衷</h1>
        <div class="intro-content">
          <p>
            在這個數位時代，平台抽成越來越重，電商運營成本也隨之水漲船高。我們觀察到，這不僅僅是商業問題，更是階級問題。
          </p>
          <p class="highlight">
            「我不希望窮者越窮、富者越富。」
          </p>
          <p>
            我們致力於降低運營成本，降低做電商的門檻。我們的目的很單純：<strong>降低資本主義帶來的衝擊</strong>，讓每一位小商家與創作者都能擁有公平競爭的生存空間。
          </p>
        </div>
      </section>

      <el-divider class="section-divider" />

      <!-- 功能卡片 -->
      <section class="features-section">
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon :size="32" color="var(--el-color-primary)"><Cpu /></el-icon>
          </div>
          <h3 class="feature-title">開源程式碼</h3>
          <p class="feature-desc">
            我們提供完整的電商平台程式碼，讓您可以完全掌控自己的系統，不再受制於封閉式平台。
          </p>
          <a href="https://github.com/supojen-outlook" target="_blank" class="feature-link">
            前往 GitHub 查看
            <el-icon><TopRight /></el-icon>
          </a>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <el-icon :size="32" color="#409EFF"><Cloudy /></el-icon>
          </div>
          <h3 class="feature-title">協助架設服務</h3>
          <p class="feature-desc">
            我們了解並非每個人都具備技術背景，因此我們正準備提供代管與架設服務。
          </p>
          <el-tag type="info" size="small">暫未開放，敬請期待</el-tag>
        </div>
      </section>

      <!-- 未來展望 -->
      <section class="vision-section">
        <h2 class="vision-title">未來展望：重塑流量的入口</h2>
        <p class="vision-desc">
          我們正在構思如何打破昂貴的廣告壟斷。或許解決方案是回歸過去，打造一個誠信的「入口網站」，直接導流至各位的獨立站。
        </p>
        <div class="vision-promise">
          <el-icon color="#67c23a" :size="20"><CircleCheckFilled /></el-icon>
          <p class="promise-text">
            我們承諾：會建立嚴謹的機制，確保平台上不存在詐騙行為，保護每一個點擊的信任。
          </p>
        </div>
      </section>

      <!-- 聯絡我們 -->
      <section class="contact-section">
        <h2 class="section-title">聯絡我們</h2>
        <div class="contact-buttons">
          <a href="mailto:xiao.hong.mao.tech@gmail.com" class="contact-btn contact-email">
            <el-icon><Message /></el-icon>
            <span>xiao.hong.mao.tech@gmail.com</span>
          </a>
          <a href="https://line.me/ti/p/[你的ID]" target="_blank" class="contact-btn contact-line">
            <el-icon><ChatDotRound /></el-icon>
            <span>加入 LINE 諮詢</span>
          </a>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Footer } from '@/components/Footer'
import { 
  Cpu, 
  Cloudy, 
  TopRight, 
  CircleCheckFilled, 
  Message, 
  ChatDotRound 
} from '@element-plus/icons-vue'
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color-page);
}

.about-main {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

/* Logo */
.about-logo {
  text-align: center;
  margin-bottom: 32px;
}

.about-logo img {
  height: 120px;
  width: auto;
  object-fit: contain;
}

/* 我們的初衷 */
.intro-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  text-align: center;
  margin-bottom: 32px;
}

.intro-content {
  border-left: 4px solid var(--el-color-primary);
  padding-left: 24px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.intro-content p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--el-text-color-regular);
  margin-bottom: 16px;
}

.intro-content p:last-child {
  margin-bottom: 0;
}

.intro-content .highlight {
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-style: italic;
  font-size: 18px;
}

.intro-content strong {
  color: var(--el-color-primary);
}

/* 分隔線 */
.section-divider {
  margin: 40px 0;
}

/* 功能卡片 */
.features-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

@media (max-width: 640px) {
  .features-section {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  background: var(--el-bg-color);
  padding: 28px;
  border-radius: 16px;
  border: 1px solid var(--el-border-color-lighter);
  transition: box-shadow 0.3s;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  margin-bottom: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--el-color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.feature-link:hover {
  opacity: 0.8;
}

.feature-link .el-icon {
  font-size: 12px;
}

/* 未來展望 */
.vision-section {
  background-color: var(--el-tertiary-container-color);
  color: var(--el-tertiary-on-container-color);
  padding: 48px 32px;
  border-radius: 24px;
  margin-bottom: 48px;
}

.vision-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

.vision-desc {
  font-size: 15px;
  line-height: 1.8;
  color: var(--el-tertiary-on-container-color);
  opacity: 0.85;
  margin-bottom: 24px;
}

.vision-promise {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.promise-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-tertiary-on-container-color);
  opacity: 0.9;
  margin: 0;
}

/* 聯絡我們 */
.contact-section {
  text-align: center;
  margin-bottom: 32px;
}

.contact-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.contact-email {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  color: var(--el-text-color-primary);
}

.contact-email:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-line {
  background: #06C755;
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(6, 199, 85, 0.3);
}

.contact-line:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 響應式調整 */
@media (max-width: 640px) {
  .about-main {
    padding: 24px 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .intro-content {
    padding-left: 16px;
  }

  .vision-section {
    padding: 32px 20px;
  }

  .vision-title {
    font-size: 20px;
  }

  .contact-buttons {
    flex-direction: column;
    width: 100%;
  }

  .contact-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
