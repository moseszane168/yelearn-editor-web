<template>
  <div class="container">
    <!-- 左边部分 -->
    <div class="left">
      <img src="https://via.placeholder.com/50" alt="Left Image" class="left-image">
    </div>

    <!-- 中间部分 -->
    <div class="middle">
      <!-- 中间的中一 -->
      <div class="middle-top">
        <button @click="showCoursePackageList" class="course-package-button">课程包列表 ></button>
        <button @click="showCourseList" class="course-package-button">{{ coursePack.title }} ></button>
        <span class="course-package-title">{{ course.title }}</span>
      </div>

      <!-- 中间的中二 -->
      <div class="middle-middle">
        <div class="course-title-large">{{ course.title }}</div>
      </div>

      <!-- 中间的中三 -->
      <div class="middle-bottom">
        <button @click="showAddDialog" class="action-button">添加</button>
        <button @click="showSplitDialog" class="action-button">拆分</button>
<!--        <button @click="showProcessDialog" class="action-button">加工</button>-->
<!--        <button @click="generateExplanation" class="action-button">生成详解</button>-->
        <button @click="deleteItem" class="action-button">删除</button>
<!--        <button @click="clearAll" class="action-button">清空</button>-->
<!--        <button @click="toggleExpand" class="action-button">展开</button>-->
<!--        <button @click="toggleCollapse" class="action-button">折叠</button>-->
        <button @click="showEditDialog" class="action-button">编辑</button>
      </div>

      <!-- 中间的中四 -->
      <div class="sentence-list">
        <div class="sentence-item" v-for="(sentence, index) in sentenceList" :key="index" @dblclick="toggleSentence(index)">
          <span class="sentence-text">{{ sentence.english }}</span>
          <div v-if="sentence.expanded" class="sentence-details">
            <span>{{ sentence.english }}</span>
            <span>{{ sentence.chinese }}</span>
            <span>{{ sentence.phonetic }}</span>
            <div class="sentence-actions">
<!--              <button @click="deleteSentence(index)">删除</button>
              <button @click="insertAbove(index)">向上插入</button>
              <button @click="insertBelow(index)">向下插入</button>
              <button @click="processSentence(index)">加工</button>-->
            </div>
          </div>
          <div class="sentence-actions">
<!--            <button @click="splitSentence(index)">拆分</button>
            <button @click="processSentence(index)">加工</button>
            <button @click="generateExplanation(index)">生成详解</button>
            <button @click="clearSentence(index)">清空</button>
            <button @click="deleteSentence(index)">删除</button>-->
          </div>
        </div>
      </div>
    </div>

    <!-- 右边部分 -->
    <div class="right">
      <!-- 右边的上 -->
      <div class="right-top">
        <textarea v-model="inputSentence" placeholder="输入句子" class="sentence-input"></textarea>
        <button @click="submitSentenceEn" class="submit-button">提交</button>
      </div>
      <div class="right-top">
        <textarea v-model="inputSentence" placeholder="可以指定中文翻译内容" class="sentence-input"></textarea>
        <button @click="submitSentenceCh" class="submit-button">提交</button>
      </div>

      <!-- 右边的下 -->
<!--      <div class="right-bottom">
        <div class="sentence-structure">句子结构</div>
        <div class="granularity-selector">
          <span>选择颗粒度</span>
          <select v-model="selectedGranularity" class="granularity-dropdown">
            <option v-for="granularity in granularityList" :key="granularity" :value="granularity">{{ granularity }}</option>
          </select>
        </div>
        <div class="sentence-display">
          <button @click="toggleStructure" class="toggle-button">三角</button>
          <span>{{ selectedSentence }}</span>
          <div v-if="structureExpanded" class="sentence-structure-details">
            &lt;!&ndash; 显示按颗粒度展开的句子结构 &ndash;&gt;
          </div>
        </div>
      </div>-->
    </div>

    <!-- 添加对话框 -->
<!--    <div v-if="addDialogVisible" class="dialog dark-dialog">
      <div class="dialog-content">
        <textarea v-model="addContent" placeholder="添加内容" class="large-input-field"></textarea>
        <div class="dialog-buttons">
          <button @click="addDialogVisible = false" class="dialog-button">取消</button>
          <button @click="confirmAdd" class="dialog-button confirm-button">确定</button>
        </div>
      </div>
    </div>-->
    <el-dialog
        title="添加句子"
        :visible.sync="addDialogVisible"
        :modal="false"
        width="35%" class="dialog dark-dialog">
      <el-form :model="sentence">
        <el-form-item label="">
          <el-input v-model="sentence.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" class="dialog-button">取 消</el-button>
        <el-button type="primary" @click="confirmAdd" class="dialog-button confirm-button">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <div v-if="editDialogVisible" class="dialog dark-dialog">
      <div class="dialog-content">
        <input v-model="editTitle" placeholder="请输入标题" class="input-field">
        <textarea v-model="editDescription" placeholder="请输入描述" class="textarea-field"></textarea>
        <div class="dialog-buttons">
          <button @click="editDialogVisible = false" class="dialog-button">取消</button>
          <button @click="confirmEdit" class="dialog-button confirm-button">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      addContent: '',
      editTitle: '',
      editDescription: '',
      sentenceList: [],
      inputSentence: '',
      selectedGranularity: '默认',
      granularityList: ['默认', '颗粒度1', '颗粒度2'],
      selectedSentence: '选择句子',
      structureExpanded: false,
      coursePack:[],
      course: [],
      sentence:[],
    };
  },
  created() {
    this.getData();
    this.getOneCoursePackData();
    this.getOneCourseData();
  },
  methods: {
    getOneCourseData() {
      //this.query.token = localStorage.getItem("token");
      console.log(this.$route.params.courseId);
      var courseId = this.$route.params.courseId;
      this.axios.get('/editor/course'+'?id='+courseId, {
        //params: this.query
      }).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.course = res.data.result
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    getOneCoursePackData() {
      //this.query.token = localStorage.getItem("token");
      console.log(this.$route.params.coursePackId);
      var coursePackId = this.$route.params.coursePackId;
      this.axios.get('/editor/course-pack'+'?id='+coursePackId, {
        //params: this.query
      }).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.coursePack = res.data.result
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    getData() {
      //this.query.token = localStorage.getItem("token");
      console.log(this.$route.params.coursePackId);
      this.axios.post('/editor/statements', {
        //params: this.query
        courseId: this.$route.params.courseId
      }).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.sentenceList = res.data.result
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    showCoursePackageList() {
      // 显示课程包列表的逻辑
      this.$router.push(`/course-packs`);
    },
    showCourseList(){
      var coursePackId = this.$route.params.coursePackId;
      this.$router.push(`/course-packs/${coursePackId}`);
    },
    showAddDialog() {
      this.addDialogVisible = true;
    },
    showEditDialog() {
      this.editDialogVisible = true;
    },
    confirmAdd() {
      var courseId = this.$route.params.courseId;
      const sentence = {
        courseId: courseId,
        english: this.sentence.content
      };
      //this.coursePackages.push(newCourse);
      this.addDialogVisible = false;
      this.sentence = { courseId: '', english: ''};

      //this.query.token = localStorage.getItem("token");
      this.axios.post('/editor/statement', sentence).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.getData();
          this.addDialogVisible = false;
        }
      }).catch(() => {
        this.loading = false;
      })

      // 确认添加的逻辑
      this.addDialogVisible = false;
    },
    confirmEdit() {
      // 确认编辑的逻辑
      this.editDialogVisible = false;
    },
    toggleSentence(index) {
      this.sentenceList[index].expanded = !this.sentenceList[index].expanded;
    },
    submitSentenceEn() {
      // 提交句子的逻辑
    },
    submitSentenceCh() {
      // 提交句子的逻辑
    },
    toggleStructure() {
      this.structureExpanded = !this.structureExpanded;
    },
    showSplitDialog(){

    },
    deleteItem(){

    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left {
  width: 5%;
  background-color: #111;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 10px;
}

.left-image {
  width: 50px;
  height: 50px;
}

.middle {
  width: 60%;
  display: flex;
  flex-direction: column;
  background-color: #222;
  color: white;
  padding: 20px;
}

.middle-top, .middle-middle, .middle-bottom, .sentence-list {
  margin-bottom: 20px;
}

.course-package-button {
  margin-right: 10px;
}

.course-title-large {
  font-size: 1.5em;
}

.action-button {
  margin-right: 10px;
}

.sentence-list {
  overflow-y: auto;
}

.sentence-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: #007bff;
  padding: 10px;
}

.sentence-text {
  flex: 1;
}

.sentence-details {
  display: flex;
  flex-direction: column;
}

.sentence-actions {
  display: flex;
  gap: 10px;
}

.right {
  width: 35%;
  display: flex;
  flex-direction: column;
  background-color: #111;
  color: white;
  padding: 20px;
}

.right-top, .right-bottom {
  margin-bottom: 20px;
}

.sentence-input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #555;
  background-color: #444;
  color: white;
}

.submit-button {
  width: 100%;
}

.sentence-structure {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.granularity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.granularity-dropdown {
  margin-left: 10px;
}

.sentence-display {
  display: flex;
  align-items: center;
}

.toggle-button {
  margin-right: 10px;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  color: white;
  width: 300px;
}

.large-input-field, .input-field, .textarea-field {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #555;
  background-color: #444;
  color: white;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
}

.dialog-button {
  margin-left: 10px;
}

.confirm-button {
  background-color: #007bff;
  color: white;
}
</style>