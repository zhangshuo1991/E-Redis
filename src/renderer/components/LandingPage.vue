<template>
  <div id="wrapper">
    <el-card class="box-card">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>CPU</span>
        </div>
        <div  class="text item">
          <span style="margin-left: 10px">制造商：{{cpuInfo.manufacturer}}</span>
          <span style="margin-left: 10px">brand：{{cpuInfo.brand}}</span>
          <span style="margin-left: 10px">speed：{{cpuInfo.speed}}</span>
          <span style="margin-left: 10px">cores：{{cpuInfo.cores}}</span>
          <span style="margin-left: 10px">physical cores：{{cpuInfo.physicalCores}}</span>
          <span style="margin-left: 10px">processors：{{cpuInfo.processors}}</span>
          <span style="margin-left: 10px">speedmin：{{cpuInfo.speedmin}}</span>
          <span style="margin-left: 10px">speedmax：{{cpuInfo.speedmax}}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span>CPU-CURRENTSPEED</span>
        </div>
        <div  class="text item">
          <span style="margin-left: 10px">avg：{{cpuCurrentspeed.avg}}</span>
          <span style="margin-left: 10px">min：{{cpuCurrentspeed.min}}</span>
          <span style="margin-left: 10px">max：{{cpuCurrentspeed.max}}</span>
          <span style="margin-left: 10px">cores：{{cpuCurrentspeed.cores}}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>MEMORY</span>
        </div>
        <div  class="text item">
          <span style="margin-left: 10px">total：{{memory.total/(1024*1024*1024)}}g</span>
          <span style="margin-left: 10px">free：{{(memory.free/(1024*1024*1024)).toLocaleString()}}g</span>
          <span style="margin-left: 10px">used：{{(memory.used/(1024*1024*1024)).toLocaleString()}}g</span>
          <span style="margin-left: 10px">active：{{(memory.active/(1024*1024*1024)).toLocaleString()}}g</span>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>battery</span>
        </div>
        <div class="text item">
          <span style="margin-left: 10px">cyclecount：{{battery.cyclecount}}</span>
          <span style="margin-left: 10px">designedcapacity：{{battery.designedcapacity}}</span>
          <span style="margin-left: 10px">maxcapacity：{{battery.maxcapacity}}</span>
          <span style="margin-left: 10px">currentcapacity：{{battery.currentcapacity}}</span>
          <span style="margin-left: 10px">serial：{{battery.serial}}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>Graphics</span>
        </div>
        <div class="text item">
          <span style="margin-left: 10px">main：{{graphics.displays[0].main}}</span>
          <span style="margin-left: 10px">size：{{graphics.displays[0].resolutionx}}*{{graphics.displays[0].resolutiony}}</span>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>Operating System</span>
        </div>
        <div class="text item">
          <span style="margin-left: 10px">distro：{{operating.distro}} {{operating.release}}</span>
          <span style="margin-left: 10px">platform：{{operating.platform}}</span>
          <span style="margin-left: 10px">hostname：{{operating.hostname}}</span>
          <span style="margin-left: 10px">codepage：{{operating.codepage}}</span>
          <span style="margin-left: 10px">serial：{{operating.serial}}</span>

        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  const si = require('systeminformation')

export default {
    name: 'landing-page',
    components: { SystemInformation },
    data () {
      return {
        cpuInfo: {},
        cpuCurrentspeed: {},
        memory: {},
        battery: {},
        graphics: {
          displays: [
            {main: '', resolutionx: '', resolutiony: ''}
          ]
        },
        operating: {}
      }
    },
    mounted () {
      const _this = this
      si.cpu(function (data) {
        _this.cpuInfo = data
      })
      si.cpuCurrentspeed(function (data) {
        console.log('- speed: ' + data)
        _this.cpuCurrentspeed = data
      })
      si.mem(function (data) {
        _this.memory = data
      })
      si.battery(function (data) {
        _this.battery = data
      })
      si.currentLoad(function (data) {
        console.log('data:', data)
      })
      si.graphics(function (data) {
        _this.graphics = data
      })
      si.osInfo(function (data) {
        _this.operating = data
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    min-height: 100vh;
    padding: 20px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>
