<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-column brand-col">
        <span class="footer-logo-text">小紅帽資訊</span>
        <p>專注於 Web 開發與電商解決方案，並為您嚴選最具溫度的工藝好物。</p>
        <div class="social-links">
          <a href="#" target="_blank" title="YouTube">
            <el-icon><VideoPlay /></el-icon>
          </a>
          <a href="#" target="_blank" title="Instagram">
            <el-icon><Picture /></el-icon>
          </a>
          <a href="#" target="_blank" title="小紅書">
            <el-icon><Reading /></el-icon>
          </a>
        </div>
      </div>
      <div class="footer-column">
        <h3>快速導覽</h3>
        <ul>
          <li><a href="/">首頁</a></li>
          <li><a href="/about">關於我們</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h3>聯絡我們</h3>
        <ul>
          <li><a href="/support">顧客中心</a></li>
          <li style="font-size: 14px; opacity: 0.7; margin-top: 10px;">service@redhat.tw</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 小紅帽資訊 (Xiao Hong Mao Technology). All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { VideoPlay, Picture, Reading } from '@element-plus/icons-vue'
</script>

<style>
.site-footer {
  background-color: var(--el-tertiary-container-color);
  color: var(--el-tertiary-on-container-color);
  padding: 50px 0 0 0;
  margin-top: 60px;
}

.footer-container {
  width: 96%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 40px;
}

@media (min-width: 1600px) {
  .footer-container {
    max-width: 1600px;
  }
}

.footer-column {
  flex: 1;
  min-width: 200px;
}

.brand-col {
  flex: 1.5;
}

.footer-logo-text {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  display: block;
  letter-spacing: 2px;
}

.brand-col p {
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.8;
  max-width: 320px;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 219, 209, 0.1);
  color: var(--el-tertiary-on-container-color);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-links .el-icon {
  font-size: 16px;
}

.social-links a:hover {
  background-color: var(--el-tertiary-on-container-color);
  color: var(--el-tertiary-container-color);
  transform: translateY(-3px);
}

.footer-column h3 {
  font-size: 16px;
  margin-bottom: 18px;
  position: relative;
  padding-bottom: 8px;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: var(--el-tertiary-on-container-color);
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 10px;
}

.footer-column ul li a {
  color: var(--el-tertiary-on-container-color);
  text-decoration: none;
  font-size: 14px;
  opacity: 0.7;
  transition: 0.2s;
}

.footer-column ul li a:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-bottom {
  width: 96%;
  max-width: 1200px;
  margin: 30px auto 0 auto;
  padding: 10px 0 15px 0;
  border-top: 1px solid rgba(255, 219, 209, 0.1);
  text-align: center;
  font-size: 12px;
  opacity: 0.5;
}

.footer-bottom p {
  margin: 0;
}

/* RWD */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-column h3::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .social-links {
    justify-content: center;
  }
  
  .brand-col p {
    margin: 0 auto 20px auto;
  }
}
</style>
