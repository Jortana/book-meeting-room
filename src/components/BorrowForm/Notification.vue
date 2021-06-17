<template>
  <div class="notification-container">
    <el-dialog
      title="教科院会场（会议室、教室）使用责任书"
      :visible.sync="visible"
      :width="width"
      center
      :before-close="close"
      v-show="!applyFormVisible && !batchApplyFormVisible && !hallApplyFormVisible"
    >
      <div>
        <p>一、我承诺对会议场馆的使用安全负全责。</p>
        <p>二、纪律方面：报告和会议内容严格遵守国家关于意识形态和涉外等方面的相关规定和纪律要求。不非法集会、传教、传销，宣讲与学术报告或与申请登记的会议内容不符的内容，不从事广告宣传、商品推销等商业活动。</p>
        <p>三、墙面方面：背景按照要求在指定地点安装，安全自负。维护馆内安静、文明的环境，不乱丢、乱写、乱画、乱贴，如违规粘贴未清理的，同意按污损面积进行赔偿。</p>
        <p>四、防火安全责任：按会场允许容量安排人数，不擅自增加人数和座位；不随意移动场馆内的桌椅等设施设备；不在场馆内乱堆、乱放，堵塞通道；不另接电器，不在场内吸烟，不使用明火；不将易燃、易爆品和有毒物带入馆内。</p>
        <p>五、食品安全责任：严格遵守场馆的规定，不将饮料、食品带入会议室内食用；自办茶点或茶歇须事先申报，饮食安全自负。</p>
        <p>六、治安责任：确保会议内容、形式，文明健康，场地秩序井然；对场内治安负全责，有治安隐患的须事先做预案，发生治安事件及时处理。负责参会人员和会议室内财物的安全，避免财物丢失。会议中指定专人负责安全工作，落实具体责任，确保安全责任落到实处。</p>
        <p>七、违反以上规定所造成的后果，申请使用方自负。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">不同意</el-button>
        <el-button type="primary" @click="showApplyForm">同意</el-button>
      </span>
    </el-dialog>
    <apply-form
      v-if="applyFormVisible"
      :visible.sync="applyFormVisible"
      :roomInfo="roomInfo"
      @close="close"
      @refresh="$emit('refresh')"
    ></apply-form>
    <batch-apply-form
      v-if="batchApplyFormVisible"
      :visible.sync="batchApplyFormVisible"
      @close="close"
      @refresh="$emit('refresh')"
    ></batch-apply-form>
    <hall-apply-form
      v-if="hallApplyFormVisible"
      :visible.sync="hallApplyFormVisible"
      :roomInfo="roomInfo"
      :isBatch="isBatch"
      @close="close"
      @refresh="$emit('refresh')">
    </hall-apply-form>
  </div>
</template>

<script>
import ApplyForm from './ApplyForm'
import BatchApplyForm from './BatchApplyForm'
import HallApplyForm from './HallApplyForm'
export default {
  name: 'Notification',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    roomInfo: {
      type: Object,
      default () {
        return null
      }
    },
    isBatch: {
      type: Boolean,
      default: false
    },
    // 用来判断是普通教室还是报告厅
    type: {
      type: String,
      default: 'normal'
    }
  },
  computed: {
    width () {
      return document.body.clientWidth > 375 ? '510px' : '90vw'
    }
  },
  data () {
    console.log(this.type)
    return {
      applyFormVisible: false,
      batchApplyFormVisible: false,
      hallApplyFormVisible: false
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    showApplyForm () {
      if (this.type === 'hall') {
        this.hallApplyFormVisible = true
      } else {
        this.isBatch ? this.batchApplyFormVisible = true : this.applyFormVisible = true
      }
    }
  },
  components: {
    ApplyForm,
    BatchApplyForm,
    HallApplyForm
  }
}
</script>

<style scoped>
.notification-container {
  position: absolute;
  left: 50%;
  top: 50%;
}

.notification-container >>> .el-dialog {
  margin-top: 3rem !important;
}
</style>
