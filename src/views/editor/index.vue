<template>
  <div class="container">
    <img src="../../assets/logo.png" alt="Image" class="image" />
    <h1 class="title">Earthworm 内容编辑器</h1>
    <p class="description">上传自己喜欢的内容到 Earthworm 中来练习吧！</p>
    <button class="button" @click="goToNextPage">Get Started</button>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    goToNextPage() {
      // 这里可以添加跳转到下一个页面的逻辑
      this.$router.push('/course-packs');
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1e1e1e; /* 暗黑色背景 */
  color: white;
  text-align: center;
  margin: 0;
  padding: 0;
}

.image {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px; /* 根据图片大小调整 */
  height: auto;
}

.title {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.description {
  font-size: 1.2em;
  margin-bottom: 40px;
}

.button {
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #4CAF50; /* 绿色按钮 */
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.button:hover {
  background-color: #45a049; /* 按钮悬停颜色 */
}
</style>