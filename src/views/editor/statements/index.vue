<template>
  <div class="container">
    <!-- 左边部分 -->
    <div class="left">
      <img src="../../../assets/logo.png" alt="Left Image" class="left-image">
    </div>

    <!-- 中间部分 -->
    <div class="middle">
      <!-- 中间的中一 -->
      <div class="middle-top">
        <span @click="showCoursePackageList" class="course-package-span">课程包列表 ></span>
        <span @click="showCourseList" class="course-package-span">{{ coursePack.title }} ></span>
        <span class="course-package-title">{{ course.title }}</span>
      </div>

      <!-- 中间的中二 -->
      <div class="middle-middle">
        <div class="course-title-large">{{ course.description }}</div>
      </div>

      <!-- 中间的中三 -->
      <div class="middle-bottom">
        <button @click="showAddDialog" class="action-button">
          <i class="el-icon-plus"></i> 添加
        </button>
        <button @click="showSplitDialog" class="action-button">
          <i class="fas fa-cut"></i> 拆分
        </button>
        <!--        <button @click="" class="action-button">
                  <i class="fas fa-rocket"></i> 加工
                </button>-->
        <!--        <button @click="" class="action-button">
                  <i class="fas fa-book"></i> 生成详解
                </button>-->
        <button @click="showDeleteDialog" class="action-button">
          <i class="el-icon-delete"></i> 删除
        </button>
        <!--        <button @click="" class="action-button">
                  <i class="fas fa-broom"></i> 清空
                </button>-->
        <!--        <button @click="" class="action-button">
                  <i class="el-icon-arrow-down"></i> 展开
                </button>-->
        <!--        <button @click="" class="action-button">
                  <i class="el-icon-arrow-up"></i> 折叠
                </button>-->
        <button @click="showEditDialog" class="action-button">
          <i class="el-icon-setting"></i> 编辑
        </button>
      </div>

      <!-- 中间的中四 -->
      <!--   @click="handleClick(index)"   -->
      <div class="sentence-list">
        <div v-for="(sentence, index) in sentenceList" :key="index">
          <div class="sentence-item"
               @dblclick="toggleSentence(index)">
            <span class="sentence-text">{{ sentence.english }}</span>
            <div class="sentence-actions">
              <!-- 'V' 下拉框 -->
              <el-dropdown @command="handleSelectChange(index, $event)" class="sentence-actions-dropdown">
                <el-button class="edit-course-button">
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item command="split" class="course-dropdown">
                    <i class="fas fa-cut"></i> 拆分
                  </el-dropdown-item>
                  <!--                  <el-dropdown-item command="process" class="course-dropdown">
                                      <i class="fas fa-rocket"></i> 加工
                                    </el-dropdown-item>-->
                  <!--                  <el-dropdown-item command="generateExplanation" class="course-dropdown">
                                      <i class="fas fa-book"></i> 生成详解
                                    </el-dropdown-item>-->
                  <!--                  <el-dropdown-item command="clear" class="course-dropdown">
                                      <i class="fas fa-broom"></i> 清空
                                    </el-dropdown-item>-->
                  <el-dropdown-item command="delete" class="course-dropdown">
                    <i class="el-icon-delete"></i> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <span>{{ sentence.expanded }}</span>
          </div>

          <div v-if="sentence.expanded"
              v-for="(statement, index) in statements"
              :key="index"
              :class="{ 'sentence-split-list': sentence.expanded }">
            <div class="sentence-split-details no-select">
              <span>{{ statement.english }}</span>
              <span>{{ statement.chinese }}</span>
              <span>{{ statement.soundmark }}</span>
              <div class="sentence-split-actions">
                <el-dropdown @command="handleSplitSelectChange(index, $event)" class="sentence-actions-dropdown">
                  <el-button class="edit-course-split-button">
                    <i class="el-icon-more"></i>
                  </el-button>
                  <el-dropdown-menu>
                    <el-dropdown-item command="delete" class="course-dropdown">
                      <i class="el-icon-delete"></i> 删除
                    </el-dropdown-item>
                    <!--                    <el-dropdown-item command="insertUpwards" class="course-dropdown">
                                          <i class="fas fa-long-arrow-alt-up"></i> 向上插入
                                        </el-dropdown-item>-->
                    <!--                    <el-dropdown-item command="insertDownwards" class="course-dropdown">
                                          <i class="fas fa-long-arrow-alt-down"></i> 向下插入
                                        </el-dropdown-item>-->
                    <!--                    <el-dropdown-item command="copy" class="course-dropdown">
                                          <i class="fas fa-copy"></i> 复制
                                        </el-dropdown-item>-->
                    <!--                    <el-dropdown-item command="process" class="course-dropdown">
                                          <i class="fas fa-rocket"></i> 加工
                                        </el-dropdown-item>-->
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右边部分 -->
    <div class="right">
      <!-- 右边的上 -->
      <div class="right-top">
        <textarea v-model="inputSentenceId" placeholder="输入句子" class="sentence-input" style="display: none;"></textarea>
        <textarea v-model="inputSentenceEn" placeholder="输入句子" class="sentence-input" ></textarea>
        <button @click="submitSentence('en')" class="submit-button">修改</button>
      </div>
      <div class="right-top">
        <textarea v-model="inputSentenceCh" placeholder="可以指定中文翻译内容" class="sentence-input"></textarea>
        <button @click="submitSentence('ch')" class="submit-button">修改</button>
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
    <el-dialog
        title="添加句子"
        :visible.sync="addDialogVisible"
        :modal="false"
        width="35%" class="dialog dark-dialog">
      <el-form :model="sentence">
        <el-form-item label="">
          <textarea v-model="sentence.content" class="addDialogTextarea"></textarea>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" class="dialog-button">取 消</el-button>
        <el-button type="primary" @click="confirmAdd" class="dialog-button confirm-button">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
        title="编辑课程"
        :visible.sync="editDialogVisible"
        :modal="false"
        width="35%" class="dialog dark-dialog">
      <el-form :model="newCourse">
        <el-form-item label="标题">
          <el-input v-model="newCourse.title" placeholder="请输入标题" class="input-field"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newCourse.description" placeholder="请输入描述" class="textarea-field"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" class="dialog-button">取 消</el-button>
        <el-button type="primary" @click="confirmCourseEdit" class="dialog-button confirm-button">确 定</el-button>
      </span>
    </el-dialog>
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
      statementList: [],
      // statements: [],
      inputSentenceId: '',
      inputSentenceEn: '',
      inputSentenceCh: '',
      selectedGranularity: '默认',
      granularityList: ['默认', '颗粒度1', '颗粒度2'],
      selectedSentence: '选择句子',
      structureExpanded: false,
      coursePack:[],
      course: [],
      sentence:[],
      newCourse: {
        title: '',
        description: ''
      },
      splitParams: [],
      updateParams: {},
    };
  },
  computed: {
    statements() {
      return this.statementList[this.inputSentenceId]
    }
  },
  created() {
    this.getData();
    this.getOneCoursePackData();
    this.getOneCourseData();
    this.getStatementData();
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
          this.newCourse = res.data.result;
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
    getStatementData() {
      //this.query.token = localStorage.getItem("token");
      console.log(this.$route.params.coursePackId);
      this.axios.post('/editor/statements', {
        //params: this.query
        courseId: this.$route.params.courseId,
        statementId: "statement"
      }).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.statementList = res.data.result;
          /*var statementList = res.data.result;
          for (let i = 0; i< statementList.length; i++){
            this.statementList[i] = statementList[i];
            //this.statementList[i].expanded = false;
            //this.statementList[i].showSelect = false;
          }*/
          console.log(this.statementList);
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
        if (res.data.code === "0"){
          var sentenceList = res.data.result;
          console.log(sentenceList);
          for (let i = 0; i< sentenceList.length; i++){
            this.sentenceList[i] = sentenceList[i];
            this.sentenceList[i].expanded = false;
            //this.sentenceList[i].showSelect = false;
          }
          console.log(this.sentenceList);
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
          this.refreshPage();
        }
      }).catch(() => {
        this.loading = false;
      })

      // 确认添加的逻辑
      this.addDialogVisible = false;
    },
    confirmCourseEdit() {
      var courseId = this.$route.params.courseId;
      const newCourse = {
        id: courseId,
        title: this.newCourse.title,
        description: this.newCourse.description
      };

      this.newCourse = { title: '', description: ''};

      //this.query.token = localStorage.getItem("token");
      this.axios.put('/editor/course', newCourse).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.getData();
          this.editDialogVisible = false;
          this.refreshPage();
        }
      }).catch(() => {
        this.loading = false;
      })

      // 确认编辑的逻辑
      this.editDialogVisible = false;
    },
    /*handleClick(index) {
      // 清除之前的定时器
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }
      // 设置新的定时器
      this.clickTimeout = setTimeout(() => {
        console.log('Single clicked on:', index);
        // 在这里处理单击事件的逻辑
      }, 200); // 200ms 的延迟，可以根据需要调整
    },*/
    toggleSentence(index) {
      // 清除定时器
      /*if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }*/
      const isExpand = this.sentenceList[index].expanded
      // 双击时其他项收起
      if (!isExpand) {
        this.sentenceList = this.sentenceList.map(i => {
          i.expanded = false
          return i
        })
      }
      console.log('Toggling expand for sentence at index start:', index,this.sentenceList[index].expanded);
      //console.log(this.sentenceList[index].showSelect);
      //this.sentenceList[index].expanded = !this.sentenceList[index].expanded;
      const item = {...this.sentenceList[index], expanded: !isExpand}
      this.$set(this.sentenceList, index, item);
      //this.sentenceList[index].showSelect = !this.sentenceList[index].showSelect;
      console.log('Toggling expand for sentence at index end:', index,this.sentenceList[index].expanded);
      console.log('sentenceList ',index,this.sentenceList[index]);
      console.log('sentenceList: ',this.sentenceList);

      this.inputSentenceId = this.sentenceList[index].id;
      this.inputSentenceEn = this.sentenceList[index].english;
      this.inputSentenceCh = this.sentenceList[index].chinese;
      //this.getStatementData();

      //this.statements = this.statementList[this.inputSentenceId];

      //console.log(this.inputSentenceId,this.statements);
    },
    refreshPage() {
      window.location.reload();
    },
    submitSentence(type) {
      // 提交句子的逻辑
      if (type === 'en'){
        this.updateParams = {
          id: this.inputSentenceId,
          english: this.inputSentenceEn,
        };
      }

      if (type === 'ch'){
        this.updateParams = {
          id: this.inputSentenceId,
          chinese: this.inputSentenceCh
        };
      }

      console.log(this.updateParams);

      //this.query.token = localStorage.getItem("token");
      this.axios.put('/editor/statement', this.updateParams).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.getData();
          this.refreshPage();
        }
      }).catch(err => {
        this.$notify.error({
          title: "错误",
          message: err
        });
        console.log(err);
      })
    },
    toggleStructure() {
      this.structureExpanded = !this.structureExpanded;
    },
    showSplitDialog(){
      this.splitSentence();
    },
    showDeleteDialog(){
      this.deleteSentence();
    },
    deleteItem(){

    },
    toggleSelect(index) {
      this.sentenceList[index].showSelect = !this.sentenceList[index].showSelect;
    },
    handleSelectChange(index, command) {
      //const selectedValue = event.target.command;
      console.log(`Selected value for sentence at index ${index}:`, command);
      // 根据选择的值执行对应的操作
      switch (command) {
        case 'split':
          this.splitSentence(index);
          break;
        case 'delete':
          this.deleteSentence(index);
          break;
        default:
          console.log('No action defined for this option');
      }
      // 隐藏 select 下拉菜单
      this.sentenceList[index].showSelect = false;
    },
    handleSplitSelectChange(index, event) {
      const selectedValue = event.target.value;
      console.log(`Selected value for sentence at index ${index}:`, selectedValue);
      // 根据选择的值执行对应的操作
      switch (selectedValue) {
        case 'split':
          this.splitSentence(index);
          break;
        case 'delete':
          this.deleteSentence(index);
          break;
        default:
          console.log('No action defined for this option');
      }
      // 隐藏 select 下拉菜单
      this.sentenceList[index].showSelect = false;
    },
    splitSentence(index) {
      var courseId = this.$route.params.courseId;
      const statementIds = [];
      console.log(index);
      if (typeof index === "undefined") {
        console.log("变量是 undefined");
      } else {
        console.log("变量不是 undefined");
        statementIds.push(this.sentenceList[index].id);
      }

      const splitParams = {
        courseId: courseId,
        statementIds: statementIds,
      };

      this.splitParams = { courseId: '', statementIds: []};

      //this.query.token = localStorage.getItem("token");
      this.axios.post('/editor/split-statement', splitParams).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.getData();
        }
      }).catch(err => {
        this.$notify.error({
          title: "错误",
          message: err
        });
        console.log(err);
      })
    },
    deleteSentence(index) {
      var courseId = this.$route.params.courseId;
      const statementIds = [];
      console.log(index);
      if (typeof index === "undefined") {
        console.log("变量是 undefined");
      } else {
        console.log("变量不是 undefined");
        statementIds.push(this.sentenceList[index].id);
      }
      const deleteParams = {
        courseId: courseId,
        statementIds: statementIds,
      };
      console.log(deleteParams);

      this.deleteParams = { courseId: '', statementIds: []};

      //this.query.token = localStorage.getItem("token");
      this.axios.delete('/editor/statement',{data: deleteParams}).then((res) => {
        console.log(res);
        if (res.data.code === "0"){
          this.getData();
          this.refreshPage();
        }
      }).catch(() => {
        this.loading = false;
      })
    }

  }
};
</script>

<style scoped>
/* 引入 FontAwesome 样式 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.container {
  display: flex;
  height: 100vh;
  margin: 0;
  padding: 0;
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
  width: 75%;
  display: flex;
  flex-direction: column;
  background-color: #222;
  color: white;
  padding: 20px;
}

.middle-top, .middle-middle, .middle-bottom, .sentence-list {
  margin-bottom: 20px;
}

.course-package-span {
  margin-right: 10px;
  color:#FFFFFF85;
}

.course-title-large {
  font-size: 1.5em;
}

.action-button {
  border: none; /* 去除边框 */
  margin-right: 10px;
  //background-color: #6366f1;
  background-color: #4CAF50;
  width: 66px;
  height: 32px;
  font-size: 12px; /* 设置字体大小为 18px */
}

.sentence-list {
  overflow-y: auto;
  justify-content: center; /* 水平居中 */
}

.sentence-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  //background-color: #6366f1;
  background-color: #4CAF50;
  padding: 10px;
}

.sentence-text {
  flex: 1;
}

.sentence-details {
  display: flex;
  flex-direction: column;
  background-color: #1f2021;
}

.sentence-actions {
  display: flex;
  gap: 10px;
  //background-color: #6366f1;
  background-color: #4CAF50;
}

.sentence-split-list {
  padding: 10px;
  border-bottom: 1px solid white; /* 设置白线 */
}

.sentence-split-details {
  display: flex;
  flex-direction: column;
  background-color: #1f2021;
  position: relative;
  height: 100%; /* 确保父容器的高度为 100% */
  justify-content: center; /* 水平居中 */
}

.sentence-split-actions {
  display: flex;
  gap: 10px;
  //background-color: #6366f1;
  background-color: #4CAF50;
  position: absolute;
  top: 0px; /* 距离父容器上边的距离 */
  right: 0px; /* 距离父容器右边的距离 */
}

.edit-course-button, .action-select {
  margin-left: 10px;
  background-color: #4CAF50;
  border: none;
}

.edit-course-split-button, .action-select {
  //margin-left: 10px;
  background-color: #111827;
  border: none;
}

.sentence-actions-dropdown {
  background-color: #4CAF50;
}

.sentence-actions-button {
  background-color: rgba(64, 158, 255, 0.5); /* 设置背景颜色为半透明 */
}

.right {
  width: 20%;
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
  width: 90%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #555;
  background-color: #111827;
  color: white;
}

.submit-button {
  border: none; /* 去除边框 */
  width: 48px;
  height: 32px;
  //background-color: #6366f1;
  background-color: #4CAF50;
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

.dark-dialog {
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  background-color: #333;
  padding: 20px;
  border-radius: 5px;
  color: white;
  width: 300px;
}

.large-input-field, .input-field, .textarea-field {
  width: 90%;
  margin-bottom: 10px;
  padding: 10px;
  //border: 1px solid #555;
  //background-color: #444;
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

.ellipsis {
  cursor: pointer;
  margin-right: 10px;
  font-size: 30px;
}

.sentence-select {
  width: 120px;
}

.addDialogTextarea {
  width: 90%;
  height: 60%;
}

.no-select {
  user-select: none; /* 禁止用户选择文本 */
}
</style>