<template>
    <div id="app" style="padding: 15px;background-color:#f4f4f4;">
        <div style="height: 50px;line-height:50px;width: 100%;margin-bottom: 10px;border: 1px solid white;padding-left: 10px">
            <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="add_connnect_drawer = true">添加链接</el-button>
        </div>
        <div style="width: 100%;">
            <div style="width: 25%;height: 80vh;float: left;overflow-x: auto;background-color: white;">
                <el-input
                    style="margin: 15px;width: 250px"
                    size="mini"
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input>
                <el-tree
                    @node-click="handleNodeClick"
                    ref="db_tree"
                    :filter-node-method="filterNode"
                    class="filter-tree"
                    :data="db_data"
                    :expand-on-click-node="true"
                    :props="defaultProps">
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span style="font-size: 13px">{{ node.label }}</span>
                    <span v-if="node.label.startsWith('db') === true" style="color: #1990FF;font-size: 13px">
                        <i class="el-icon-circle-plus-outline" @click="addData(node,data)"></i><i class="el-icon-refresh-right" style="cursor: pointer;margin-left: 5px" @click="handleNodeClick(data,node)"></i>
                    </span>
                  </span>
                </el-tree>
            </div>

            <div style="width: 1%;min-height: 100px;float: left">

            </div>
            <div v-loading="table_data_loading" style="width: 70%;min-height: 100px;float: left;background-color: white;padding: 10px">
                <el-input
                    v-model="key_search"
                    size="mini"
                    style="margin:15px 15px 15px 0px;width: 300px"
                    placeholder="输入关键字搜索"/>
                <el-table
                    border
                    :data="(hash_table_data.filter(data => !key_search || data.redis_value.toLowerCase().includes(key_search.toLowerCase()))).slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    :header-row-style="{height:'40px',fontSize: '13px'}"
                    :header-cell-style="{padding:'0px',textAlign: 'center',backgroundColor: '#F2F2F2'}"
                    :row-style="{height:'40px',fontSize: '13px'}"
                    :cell-style="{padding:'0px'}"
                >
                    <el-table-column
                        label="序号"
                        align="center"
                        type="index"
                    />
                    <el-table-column
                        v-if="redis_key_show"
                        label="key"
                        align="center"
                        prop="redis_key"
                    />
                    <el-table-column
                        label="value"
                        align="center"
                        prop="redis_value"
                    />
                    <el-table-column
                        v-if="redis_score_show"
                        label="score"
                        align="center"
                        sortable
                        prop="redis_score"
                    />
                    <el-table-column
                        label="数据类型"
                        align="center"
                        prop="data_type"
                    />
                </el-table>
                <div class="block" style="text-align: right;width: 100%;margin-top: 10px">
                    <el-pagination
                        :current-page="currentPage"
                        :page-size="pageSize"
                        :total="total"
                        layout="total, prev,pager, next,sizes,jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </div>
        </div>
        <div style="clear: both"></div>
        <el-dialog
            title="新增key-value"
            :visible.sync="dialogVisible"
            width="500px"
            >
            <el-form :model="form">
                <el-form-item required label="键名" :label-width="formLabelWidth">
                    <el-input v-model="form.key_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item required label="数据类型" :label-width="formLabelWidth">
                    <el-select v-model="form.key_type" placeholder="请选择数据类型">
                        <el-option
                            v-for="item in key_type_options"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-show="form.key_type === 'hash'" required label="key" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.hash_key"></el-input>
                </el-form-item>
                <el-form-item required label="value" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.key_value"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :visible.sync="add_connnect_drawer"
            width="650px"
        >
            <template slot="title">
                <div class="c-data-h1">添加链接</div>
            </template>
            <div style="margin: auto;width: 100px;height: 60px;">
                <svg-icon icon-class="redis" style="font-size: 54px;color: red"></svg-icon>
            </div>
            <div style="text-align: center;width: 550px;border: 1px dashed #D1D1D1;padding: 10px;margin: auto;">
                <div>
                    <el-form ref="form" :model="login_form" label-width="120px">
                        <el-form-item required label="数据库连接名">
                            <el-input v-model="login_form.name"></el-input>
                        </el-form-item>
                        <el-form-item required label="连接地址">
                            <el-input v-model="login_form.addr"></el-input>
                        </el-form-item>
                        <el-form-item required label="端口">
                            <el-input type="number" v-model="login_form.port"></el-input>
                        </el-form-item>
                        <el-form-item required label="密码">
                            <el-input ref="password" :type="passwordType" v-model="login_form.password">
                                <template slot="append">
                                    <span class="show-pwd" @click="showPwd">
                                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                                    </span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="IP地址类型">
                            <el-select style="width: 100%" v-model="login_form.ip_type" placeholder="请选择">
                                <el-option
                                        v-for="item in ip_type_options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div style="text-align: right">
                                <el-button type="primary" @click="onSubmit">立即连接</el-button>
                                <el-button type="success" @click="testConn">测试连接</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const Redis = require('ioredis')
export default {
  name: 'RedisPage',
  data () {
    return {
      ip_type_options: [
        {
          label: 'IPv4',
          value: 4
        },
        {
          label: 'IPv6',
          value: 6
        }
      ],
      login_form: {
        name: '',
        addr: '',
        port: '',
        ip_type: 4,
        password: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      add_connnect_drawer: false,
      form: {
        key_name: '',
        key_type: '',
        hash_key: '',
        key_score: '',
        key_value: ''
      },
      key_type_options: [
        'set', 'string', 'list', 'hash', 'zset'
      ],
      formLabelWidth: '100px',
      dialogVisible: false,
      filterText: '',
      redis_key_show: false,
      redis_score_show: false,
      key_search: '',
      table_data_loading: false,
      db_data: [],
      hash_table_data: [],
      set_table_data: [],
      redisClient: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      passwordType: 'password',
      select_redis_client: null
    }
  },
  watch: {
    filterText (val) {
      this.$refs.db_tree.filter(val)
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    initData () {
      const _this = this
      const redisDataInfo = JSON.parse(localStorage.getItem('redisDataInfo'))
      if (redisDataInfo !== null && redisDataInfo !== undefined) {
        _this.db_data = []
        _this.redisClient = []
        redisDataInfo.forEach(function (thisItem, index) {
          const children = []
          for (let i = 0; i < 16; i++) {
            children.push(
              {id: i, label: 'db_' + i, db_index: index}
            )
          }
          _this.db_data.push(
            {
              id: thisItem.name, label: thisItem.name, children: children
            }
          )
          const redis = new Redis({
            port: thisItem.port, // Redis port
            host: thisItem.addr, // Redis host
            family: thisItem.ip_type, // 4 (IPv4) or 6 (IPv6)
            password: thisItem.password,
            db: 0
          })
          _this.redisClient.push(redis)
        })
      }
    },
    onSubmit () {
      const redis = new Redis({
        port: this.login_form.port, // Redis port
        host: this.login_form.addr, // Redis host
        family: this.login_form.ip_type, // 4 (IPv4) or 6 (IPv6)
        password: this.login_form.password,
        db: 0
      })
      const _this = this
      redis.ping(function (errInfo, data) {
        if (data === 'PONG' && (errInfo === undefined || errInfo === null)) {
          _this.$message({
            type: 'success',
            message: '连接成功'
          })
          localStorage.setItem('connnect_info', JSON.stringify(_this.form))

          let redisDataInfo = JSON.parse(localStorage.getItem('redisDataInfo'))
          if (redisDataInfo === null || redisDataInfo === undefined) {
            redisDataInfo = []
          }
          redisDataInfo.push(_this.login_form)
          localStorage.setItem('redisDataInfo', JSON.stringify(redisDataInfo))
          _this.login_form.port = ''
          _this.login_form.addr = ''
          _this.login_form.ip_type = 4
          _this.login_form.password = ''
          _this.login_form.name = ''
          _this.add_connnect_drawer = false
          redis.disconnect()
          _this.initData()
        } else {
          _this.$message({
            type: 'error',
            message: '连接失败:' + errInfo.toString()
          })
        }
        redis.disconnect()
      })
    },
    testConn () {
      const redis = new Redis({
        port: this.login_form.port, // Redis port
        host: this.login_form.addr, // Redis host
        family: this.login_form.ip_type, // 4 (IPv4) or 6 (IPv6)
        password: this.login_form.password,
        db: 0,
        maxRetriesPerRequest: 5
      })
      const _this = this
      redis.ping(function (errInfo, data) {
        if (data === 'PONG' && (errInfo === undefined || errInfo === null)) {
          _this.$message({
            type: 'success',
            message: '连接成功'
          })
        } else {
          _this.$message({
            type: 'error',
            message: '连接失败：' + errInfo.toString()
          })
        }
        redis.disconnect()
      })
    },
    saveData () {
      if (this.form === '' || this.form === undefined) {
        this.$message({
          message: '表单内容为空，无法提交',
          type: 'warning'
        })
        return
      }
      if (this.form.key_type === 'set') {
        this.select_redis_client.sadd(this.form.key_name, this.form.key_value)
      } else if (this.form.key_type === 'string') {
        this.select_redis_client.set(this.form.key_name, this.form.key_value)
      } else if (this.form.key_type === 'zset') {
        this.select_redis_client.zadd(this.form.key_name, this.form.key_score, this.form.key_value)
      } else if (this.form.key_type === 'hash') {
        this.select_redis_client.hset(this.form.key_name, this.form.hash_key, this.form.key_value)
      } else if (this.form.key_type === 'list') {
        this.select_redis_client.lpush(this.form.key_name, this.form.key_value)
      }
      this.$message({
        message: '添加成功！',
        type: 'success'
      })
      this.dialogVisible = false
    },
    addData (nodeData, selectNode) {
      this.dialogVisible = true
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    async handleNodeClick (nodeData, selectNode) {
      if (selectNode.level === 1) {
        return
      }
      const _this = this
      const redis = _this.redisClient[nodeData.db_index]
      this.select_redis_client = _this.redisClient[nodeData.db_index]
      redis.info(function (err, data) {
        console.log(err)
        console.log(data)
      })
      if (nodeData.label.startsWith('db_')) {
        redis.select(nodeData.id, function (errTwo, data) {
          console.log(data)
        })
        redis.keys('*', function (errTwo, data) {
          _this.$set(nodeData, 'children', [])
          data.forEach(thisItem => {
            const newChild = { id: thisItem, label: thisItem, children: [], db_index: nodeData.db_index }
            nodeData.children.push(newChild)
          })
          nodeData.children.sort()
          if (selectNode.expanded === true) {
            selectNode.expanded = false
          } else {
            selectNode.expanded = true
          }
        })
      } else {
        var data = await redisType('type', nodeData.id, redis)
        console.log(data)
        if (data === 'hash') {
          _this.table_data_loading = true
          redis.hgetall(nodeData.id, function (errTwo, dataTwo) {
            _this.hash_table_data = []
            for (const p in dataTwo) {
              _this.hash_table_data.push(
                {
                  redis_key: p, redis_value: dataTwo[p], data_type: 'HASH'
                }
              )
            }
            _this.total = _this.hash_table_data.length
            _this.redis_score_show = false
            _this.redis_key_show = true
            _this.table_data_loading = false
          })
        }
        if (data === 'set') {
          _this.table_data_loading = true
          redis.smembers(nodeData.id, function (errTwo, dataTwo) {
            _this.hash_table_data = []
            dataTwo.forEach(thisItem => {
              _this.hash_table_data.push(
                {
                  redis_value: thisItem, data_type: 'SET'
                }
              )
            })
            _this.total = _this.hash_table_data.length
            _this.redis_score_show = false
            _this.redis_key_show = false
            _this.table_data_loading = false
          })
        }
        if (data === 'string') {
          _this.table_data_loading = true
          redis.get(nodeData.id, function (errTwo, dataTwo) {
            _this.hash_table_data = []
            _this.hash_table_data.push(
              {
                redis_value: dataTwo, data_type: 'STRING'
              }
            )
            _this.total = _this.hash_table_data.length
            _this.redis_score_show = false
            _this.redis_key_show = false
            _this.table_data_loading = false
          })
        }
        if (data === 'zset') {
          _this.table_data_loading = true
          redis.zrange(nodeData.id, 0, -1, 'WITHSCORES', function (errTwo, dataTwo) {
            _this.hash_table_data = []
            for (let zsetIndex = 0; zsetIndex < dataTwo.length * 2; zsetIndex = zsetIndex + 2) {
              _this.hash_table_data.push(
                {
                  redis_value: dataTwo[zsetIndex], redis_score: dataTwo[zsetIndex + 1], data_type: 'ZSET'
                }
              )
            }
            _this.total = _this.hash_table_data.length
            _this.redis_score_show = true
            _this.redis_key_show = false
            _this.table_data_loading = false
          })
        }
        if (data === 'list') {
          _this.table_data_loading = true
          redis.llen(nodeData.id, function (errTwo, dataLength) {
            redis.lrange(nodeData.id, 0, dataLength, function (errThree, dataTwo) {
              _this.hash_table_data = []
              dataTwo.forEach(thisItem => {
                _this.hash_table_data.push(
                  {
                    redis_value: thisItem, data_type: 'LIST'
                  }
                )
              })
              _this.total = _this.hash_table_data.length
              _this.redis_score_show = false
              _this.redis_key_show = false
              _this.table_data_loading = false
            })
          })
        }
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    }

  }
}

function redisType (actionName, key, redisClient) {
  return new Promise((resolve, reject) => {
    redisClient[actionName](key, function (errTwo, data) {
      resolve(data)
    })
  })
}
</script>

<style scoped>
/deep/ .el-dialog__body{
    padding-left: 0px;
}
.c-data-h1{
    border-left: 7px solid #0071C8;
    padding-left: 5px;
    height: 25px;
    line-height: 25px;
    font-size: 14px;
    color: #464c5b;
    font-weight: bolder;
}
</style>
