<template>
  <div>
    <div id="search" @keyup.enter="searchRecord">
      <div id="text">记录搜索</div>
      <div id="search-type">
        <el-select
          v-model="search.searchType"
          clearable placeholder="请选择"
          @change="clearContent"
          @clear="getRecord(1)">
          <el-option
            v-for="item in search.searchTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="search-building" v-if="search.searchType === 'room'">
        <el-select v-model="search.buildingID" clearable placeholder="请选择楼宇">
          <el-option
            v-for="item in search.buildings"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="search-content" :class="search.searchType === 'room' ? 'short' : 'long'">
        <el-input
          v-if="search.searchType !== 'date'"
          :placeholder="'请输入' + inputHolder"
          v-model="search.content"
          clearable>
        </el-input>
        <el-date-picker
          v-else
          v-model="search.content"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div id="search-btn">
        <el-button type="primary" @click="searchRecord">搜索</el-button>
      </div>
    </div>
    <el-table
      :data="record"
      v-loading="recordLoading"
    >
      <el-table-column
        prop="date"
        label="日期">
      </el-table-column>
      <el-table-column
        prop="room"
        label="教室">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="起始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="username"
        label="申请人">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="理由">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系方式">
      </el-table-column>
    </el-table>
    <div id="pages">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="getRecord">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'All',
  created () {
    this.getRecordNum()
    this.getRecord(1)
    // 如果state为空就获取
    if (this.$store.state.building.length === 0) {
      this.getAllRoom()
    } else {
      this.saveBuildingAndRoom()
    }
  },
  computed: {
    page () {
      return Math.ceil(this.total / 10)
    },
    inputHolder () {
      let holder = this.search.searchTypes.find(type => {
        if (type.value === this.search.searchType) {
          return type
        }
      })
      return holder === undefined ? '' : holder.label
    }
  },
  data () {
    return {
      total: 0,
      record: [],
      recordLoading: false,
      building: [],
      search: {
        searchTypes: [
          {
            label: '姓名',
            value: 'username'
          },
          {
            label: '会议室',
            value: 'room'
          },
          {
            label: '日期',
            value: 'date'
          }
        ],
        searchType: '',
        buildings: [],
        buildingID: '',
        content: ''
      }
    }
  },
  methods: {
    getRecordNum () {
      this.$axios
        .get('getRecordNum')
        .then(successResponse => {
          this.total = successResponse.data
        })
        .catch(failResponse => {
          this.$message({
            showClose: true,
            message: '服务器无响应',
            type: 'error',
            duration: 1500,
            offset: 80
          })
          this.loading = false
        })
    },
    getRecord (page) {
      this.loading = true
      this.$axios
        .post('getRecordByPage', {
          page: page
        })
        .then(successResponse => {
          this.loading = false
          this.record = []
          let records = successResponse.data
          records.forEach(record => {
            let { time: date, buildingName, roomName, startTime, endTime, username, reason, phone } = record
            this.record.push({date, startTime, endTime, username, reason, phone, room: buildingName + ' ' + roomName})
          })
        })
        .catch(failResponse => {
          this.$message({
            showClose: true,
            message: '服务器无响应',
            type: 'error',
            duration: 1500,
            offset: 80
          })
          this.loading = false
        })
    },
    getAllRoom () {
      // 获取所有的建筑和房间号
      this.$axios
        .get('/getAllRoom')
        .then(successResponse => {
          this.$store.commit('saveBuilding', successResponse.data)
          this.saveBuildingAndRoom()
        })
        .catch(failResponse => {
        })
    },
    saveBuildingAndRoom () {
      this.building = this.$store.state.building
      this.search.buildings = []
      this.building.forEach(building => {
        this.search.buildings.push({
          label: building.name,
          value: building.id
        })
      })
    },
    searchRecord () {
      let data = {
        type: this.search.searchType
      }
      if (data.type === 'room') {
        data.content = {
          buildingID: this.search.buildingID,
          roomName: this.search.content
        }
      } else if (data.type === 'date') {
        let date = new Date(this.search.content)
        data.content = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
      } else {
        data.content = this.search.content
      }
      console.log(data)
      this.$axios
        .post('/getRecordByEle', data)
        .then(successResponse => {
          console.log(successResponse)
          this.record = []
          let records = successResponse.data
          records.forEach(record => {
            let { time: date, buildingName, roomName, startTime, endTime, username, reason, phone } = record
            this.record.push({date, startTime, endTime, username, reason, phone, room: buildingName + ' ' + roomName})
          })
        })
        .catch(failResponse => {
        })
    },
    clearContent () {
      this.search.content = ''
    }
  }
}
</script>

<style scoped>
#pages {
  background: #fff;
  padding-top: 20px;
}

#search {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  margin-top: 10px;
  margin-bottom: 10px;
}

#text {
  display: grid;
  grid-column: 1 / span 2;
  place-items: center;
}

#search-type {
  grid-column: 3 / span 3;
}

#search-building {
  grid-column: 6 / span 3;
}

.short {
  grid-column: 9 / span 3;
}

.long {
  grid-column: 6 / span 6;
}

#search-btn {
  grid-column: 12 / span 1;
  margin-right: 10px;
}
</style>
