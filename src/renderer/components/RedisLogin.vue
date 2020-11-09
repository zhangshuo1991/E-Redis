<template>
    <div id="app" style="height: 90vh;">
        <div style="margin: auto;width: 100px;height: 60px;margin-top: 50px">
            <svg-icon icon-class="redis" style="font-size: 54px;color: red"></svg-icon>
        </div>
        <div style="text-align: center;width: 550px;border: 1px dashed #D1D1D1;padding: 10px;margin: auto;">
            <div>
                <el-form ref="form" :model="form" label-width="120px">
                    <el-form-item required label="数据库连接名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item required label="连接地址">
                        <el-input v-model="form.addr"></el-input>
                    </el-form-item>
                    <el-form-item required label="端口">
                        <el-input type="number" v-model="form.port"></el-input>
                    </el-form-item>
                    <el-form-item required label="密码">
                        <el-input type="password" v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="IP地址类型">
                        <el-select style="width: 100%" v-model="form.ip_type" placeholder="请选择">
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
    </div>
</template>

<script>
  const Redis = require('ioredis')

  export default {
    name: 'RedisLogin',
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
        form: {
          name: '',
          addr: '',
          port: '',
          ip_type: 4,
          password: ''
        }
      }
    },
    methods: {
      onSubmit () {
        const redis = new Redis({
          port: this.form.port, // Redis port
          host: this.form.addr, // Redis host
          family: this.form.ip_type, // 4 (IPv4) or 6 (IPv6)
          password: this.form.password,
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
            _this.form.port = ''
            _this.form.addr = ''
            _this.form.ip_type = ''
            _this.form.password = ''
            _this.form.name = ''
            redis.disconnect()
            _this.$router.push({
              path: '/redis'
            })
          } else {
            _this.$message({
              type: 'error',
              message: '连接失败'
            })
          }
          redis.disconnect()
        })
      },
      testConn () {
        const redis = new Redis({
          port: this.form.port, // Redis port
          host: this.form.addr, // Redis host
          family: this.form.ip_type, // 4 (IPv4) or 6 (IPv6)
          password: this.form.password,
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
      }
    }
  }
</script>

<style scoped>

</style>
