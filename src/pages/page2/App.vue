<template>
  <div v-cloak>
    <div class="act_bg">
      <div class="act_con">
        <div v-if="render.count_down!=''" class="countdown_wrap">
          <div class="countdown_tit">新人专享福利倒计时</div>
          <ul class="time_total">
            <li>剩余</li>
            <li class="time_num">{{ day }}</li><li>天</li>
            <li class="time_num">{{ hour }}</li><li>小时</li>
            <li class="time_num">{{ minute }}</li><li>分</li>
            <li class="time_num">{{ second }}</li><li>秒</li>
          </ul>
        </div>
        <div class="act_tit_bg">
          <img src="img/act_tit_bg.png">
        </div>
        <div class="gift_box">
          <div class="jiqi_bg">
            <div class="prizewinner_list">
              <!--              <van-swipe-->
              <!--                :show-indicators="false"-->
              <!--                :autoplay="2000"-->
              <!--                :loop="true"-->
              <!--                :touchable="false"-->
              <!--                vertical-->
              <!--              >-->
              <!--                <van-swipe-item v-for="(item,index) in userlist" :key="index">-->
              <!--                  恭喜用户<span>&nbsp;{{ item.nickname }}&nbsp;</span>抽中<span class="prize1">【<span class="prize">{{ item.prize }}</span>】</span>-->
              <!--                </van-swipe-item>-->
              <!--              </van-swipe>-->
            </div>
            <div id="gift_box_bg" class="gift_box_bg gift_box_bg2">
              <div class="gift_item">
                <div v-for="(prize,index) in prizelist" :key="index" class="gift_icon">
                  <!--                <span :id="'gift'+prize.turnId" :class="index==0?'aa':''">-->
                  <span :id="'gift'+prize.turnId">
                    <div class="gift_img"><img :src="prize.image"></div>
                    <div class="gift_info">
                      <div class="gift_tit">{{ prize.prizename }}</div>
                      <div class="gift_num">{{ prize.des }}</div>
                    </div>

                    <!--                  <div class="light_icon"><img src="img/light_icon.png"/></div>-->
                  </span>
                  <!--                  <span v-if="index==3" id="start_btn" @click="render.current_coin>0?startLottery():''">-->
                  <span
                    v-if="index==3"
                    id="start_btn"
                    @click="render.current_coin>0?startLottery():''"
                  >
                    <!--                  <a class="go_btn" :href="render.current_coin<1?'#task_box':''">-->
                    <a v-if="render.current_coin<1" class="go_btn" href="#task_box">
                      <!--                    <img v-if="render.current_coin<200"  src="img/go.png"/>-->
                      <!--                    <img v-else :id="turnType?'go_btn':''"  src="img/go.png"/>-->
                    </a>
                    <!--                  <div class="go_star">-->
                    <!--                    <div class="star"><img src="img/star.png"></div>-->
                    <!--                  </div>-->
                  </span>
                </div>
              </div>
            </div>
            <div class="chance_num">剩余抽奖机会<span>{{ render.current_coin }}</span>次</div>
          </div>
        </div>

        <div id="task_box" class="act_box">
          <div class="act_tit"><img src="img/add_tit.png"> </div>
          <div v-for="(task,index) in tasklist" :key="index" class="chance_item">
            <div class="chance_left">
              <div class="task_tit">{{ task.title }}</div>
              <div class="task_tips" v-html="task.tips" />
            </div>
            <div class="chance_right">
              <button class="task_btn" @click="payMon(task.h5_uri.uri_type,task.h5_uri.uri_param)">去充值</button>
              <div class="task_rate">{{ task.progress }}/{{ task.num }}</div>
            </div>
          </div>
        </div>
        <div class="act_box">
          <div class="act_tit"><img src="img/add_tit.png"> </div>
          <div class="rule_text">
            <p>1、用户可通过完成任务获得抽奖机会，抽到的金币、座驾、头饰等都会实时到达您的账户。</p>
            <p>2、本活动仅限新注册账号限时参与，共计7天倒计时，请在到期前用完抽奖次数，到期后活动结束，无法继续抽奖，继续充值将不再获得抽奖机会。</p>
            <p>3、活动最终解释权归本平台所有，与苹果公司无关</p>
          </div>
        </div>
      </div>
    </div>
    <div id="shade_box">
      <div class="shade-con">
        <div class="img-wrap">
          <div class="award_image"> <img :src="award.image"></div>
          <div class="award-name">{{ award.name }}&nbsp;{{ award.des }}</div>
        </div>
        <div class="get-btn" @click="closeDialog">开心收下</div>
      </div>
    </div>
    <div id="shade_box1">
      <div class="verify_con">
        <div class="verify_text">是否充值成功</div>
        <div class="verify_btn">
          <div @click="verifyPay()">否</div>
          <div class="verify_ok" @click="verifyPay()">是</div>
        </div>
      </div>
    </div>
    <div id="tips">活动已结束!</div>
  </div>
</template>

<script>
import { postHandle, getQueryString, jump2native } from '../../library/util'
import { api } from '../../library/constants'
import $ from 'jquery'
export default {
  name: 'Page2',
  data() {
    return {
      default_url: api,
      ajaxData: {
        uid: getQueryString('uid'),
        token: getQueryString('token')
      },
      render: {},
      lottery: {},
      prizelist: [],
      userlist: [],
      turnType: true,
      pageData: {},
      award: {},
      tasklist: [],
      day: 0,
      hour: '00',
      minute: '00',
      second: '00',
      location: 0// 获奖位置
    }
  },
  mounted: function() {
    const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    // 获取html的dom
    const htmlDom = document.getElementsByTagName('html')[0]
    // 设置html的font-size
    htmlDom.style.fontSize = htmlWidth / 10 + 'px'
    window.addEventListener('resize', (e) => {
      const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
      htmlDom.style.fontSize = htmlWidth / 10 + 'px'
    })
  },
  created: function() {
    this.getRender()
  },
  methods: {
    payMon(uri_type, uri_param) {
      // zhuge.track('首充转盘-任意金额按钮、首充转盘-满100元按钮')
      setTimeout(function() {
        $('#shade_box1').css('display', 'flex')
      }, 1500)
      jump2native(uri_type, uri_param)
    },
    verifyPay() {
      this.getRender()
      $('#shade_box1').css('display', 'none')
    },
    countdown(go_time_val) {
      // let go_time = new Date('2021-05-30 00:00:00')
      // console.log(this.integralInfo.expire_time.replace(/\-/g, '/'))
      const go_time = new Date(go_time_val.replace(/\-/g, '/'))
      var now_time = new Date()
      var alltime = go_time.getTime() - now_time.getTime() // 总的时间（毫秒）
      var second1 = parseInt((alltime / 1000) % 60) // 秒
      var minute1 = parseInt((alltime / 1000 / 60) % 60) //  分钟
      var hour1 = parseInt((alltime / 1000 / 60 / 60) % 24) // 小时
      var day1 = parseInt((alltime / 1000 / 60 / 60 / 24) % 30) // 天数
      const that = this
      if (alltime > 0) {
        that.day = day1
        that.hour = (hour1 < 10 ? '0' + hour1 : hour1)
        that.minute = (minute1 < 10 ? '0' + minute1 : minute1)
        that.second = (second1 < 10 ? '0' + second1 : second1)
        // that.time =  day + "天" + (hour<10?'0'+hour:hour) + ":" + (minute<10?'0'+minute:minute) + ":" + (scend<10?'0'+scend:scend);
        setTimeout(function() {
          that.countdown(go_time_val)
        }, 1000)
      }
    },
    closeDialog() {
      $('#shade_box').css('display', 'none')
      this.turnType = true
    },
    turnStart() {
      this.turnType = false
      // 清除上次中奖记录
      $('.aa').removeClass('aa')
      const that = this
      this.getLottery(function() {
        let num = 6 // 奖品序号
        const times = 16 + that.location
        let time = 0 // 当前的旋转次数
        const speed = 100 // 转盘速度
        num = 0
        const timer = setInterval(function() {
          $('#gift' + num).addClass('aa')
          $('#gift' + (num - 1)).removeClass('aa')
          num++
          if (num > 7) {
            $('#gift7').removeClass('aa')
            num = 0
          }
          time++
          if (time > times) { // 抽中
            clearInterval(timer)
            $('#shade_box').css('display', 'flex')// 抽奖弹框
            $('#gift' + that.location).addClass('aa')
            that.turnType = true
          }
        }, speed)
      })
    },
    getRender: function() {
      console.log('111')
      var that = this
      that.ajaxData.url = '/events/sprice/render'
      postHandle(that.ajaxData, function(data) {
        if (data.result == 1) {
          that.render = data.data
          if (data.data.count_down != '') {
            that.countdown(data.data.count_down)
          }
          that.userlist = data.data.user_list
          that.prizelist = data.data.prize_list
          that.prizelist.forEach((item, index) => {
            if (index < 3) {
              item.turnId = index
            } else if (index == 3) {
              item.turnId = 7
            } else if (index == 4) {
              item.turnId = 3
            } else if (index == 5) {
              item.turnId = 6
            } else if (index == 6) {
              item.turnId = 5
            } else if (index == 7) {
              item.turnId = 4
            }
          })
          that.tasklist = data.data.task_list
          that.render.task_tips_status = data.data.task_tips_status
        } else {
          alert(data.msg)
        }
      })
    },
    // POST 抽奖
    getLottery: function(callback) {
      var that = this
      that.ajaxData.url = '/events/sprice/lottery'
      postHandle(that.ajaxData, function(data) {
        if (data.result == 1) {
          that.award = data.data
          that.render.current_coin = data.data.current_coin
          // that.prizelist在奖品列表里通过奖品id查询到奖品所在位置
          for (let i = 0; i < that.prizelist.length; i++) {
            if (data.data.id == that.prizelist[i].id) {
              that.location = that.prizelist[i].turnId
              typeof callback == 'function' && callback()
              return true
            }
          }
        } else {
          alert(data.msg)
          that.turnType = true
        }
      })
    },
    // POST 领取任务
    getTask: function(taskid) {
      var that = this
      that.taskid = taskid
      that.ajaxData.taskid = taskid
      that.ajaxData.url = '/events/sprice/receivetask'
      postHandle(that.ajaxData, function(data) {
        if (data.result == 1) {
          $('#tips').css('display', 'flex')
          setTimeout(function() {
            $('#tips').css('display', 'none')
          }, 2000)
          // 领取之后刷新数据
          that.getRender()
        } else {
          alert(data.msg)
        }
      })
    },
    // 开始抽奖
    startLottery: function() {
      if (this.turnType) {
        this.turnStart()
        // return;
      }
    }

  }
}
</script>
<!--<style lang="scss" scoped>-->
<!--  a {-->
<!--    color: red-->
<!--  }-->
<!--</style>-->
<style lang="scss" scoped>
  @function px2rem($px) {
    $rem: 37.5px;
    @return ($px / $rem) + rem;
  }
  body{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;
  }
  .act_bg{
    background-image: url("./img/bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: px2rem(375px);
    height: px2rem(1294px);
    position: absolute;
    .act_con{
      .countdown_wrap{
        padding: px2rem(9px) 0;
        text-align: center;
        color: #ffffff;
        background: linear-gradient(180deg, #009170 0%, #009170 100%);
        .countdown_tit{
          font-size: px2rem(16px);
          font-weight: bold;
          margin: 0 0 px2rem(8px);
        }
        .time_total{
          display: flex;
          justify-content: center;
          font-size: px2rem(12px);
          height: px2rem(18px);
          align-items: center;
          font-weight: 500;
          .time_num{
            width: px2rem(22px);
            height: px2rem(18px);
            background: #FFFFFF;
            font-size: px2rem(16px);
            font-weight: bold;
            color: #FF0000;
            line-height: px2rem(20px);
            margin: 0 px2rem(2px);
          }
        }
      }
      .act_tit_bg{
        img{
          height: px2rem(137px);
        }
      }
      .gift_box{
        position: relative;
        padding: 0 px2rem(19px);
        margin-top: px2rem(76px);
        .jiqi_bg{
          background-image: url("./img/jiqi.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          height: px2rem(418px);
          padding-top: px2rem(27px);
          .prizewinner_list{
            margin: 0 px2rem(20px);
            text-align: center;
            font-size: px2rem(14px);
            font-weight: bold;
            color: #FFFFFF;
            line-height: px2rem(27px);
            width: px2rem(294px);
            height: px2rem(27px);
            background: #F1A300;
            box-shadow: 0 0 px2rem(7px) 0 rgba(255,255,255,0.5);
            border-radius: px2rem(19px);
            .van-swipe{
              height: px2rem(27px);
            }
            .van-swipe-item{
              line-height: px2rem(27px);
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              span{
                color: #FF4600;
              }
              .prize1{
                display: inline-block;
                height: px2rem(30px);
                line-height: px2rem(33px);
                .prize{
                  display: inline-block;
                  height: px2rem(15px);
                  line-height: px2rem(18px);
                  max-width: px2rem(130px);
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
          .gift_box_bg{
            margin: px2rem(2px) px2rem(4px) 0;
            background-image: url("./img/light1.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: px2rem(308px);
            width: px2rem(329px);
            .gift_item{
              padding: px2rem(21px) px2rem(20px);
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              .gift_icon{
                display: flex;
                span{
                  display: inline-block;
                  width: px2rem(91px);
                  height: px2rem(91px);
                  background-image: url("./img/gift_bg.png");
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  margin: px2rem(2px) 0 0 px2rem(4px);
                  font-size: px2rem(9px);
                  font-weight: 500;
                  color: #EA2B00;
                  text-align: center;
                  line-height: px2rem(13px);
                  position: relative;
                  .gift_img{
                    margin-top: px2rem(3px);
                    height: px2rem(58px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img{
                      max-width: px2rem(58px);
                      max-height: px2rem(58px);
                    }
                  }
                  .gift_info{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height:  px2rem(29px);
                  }
                }
                #start_btn{
                  display: inline-block;
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-image: url("./img/get_btn.png");
                  .go_btn{
                    display: block;
                    height: 100%;
                    width: 100%;
                    #go_btn{
                      -webkit-animation: scaleDraw 3s ease-in-out infinite;
                    }
                    @keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
                      0%{
                        transform: scale(1);  /*开始为原始大小*/
                      }
                      25%{
                        transform: scale(1.2); /*放大1.1倍*/
                      }
                      50%{
                        transform: scale(1);
                      }
                      75%{
                        transform: scale(1.2);
                      }
                    }
                  }
                }
                .aa{
                  background-image: url("./img/active_gift.png");
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  height: px2rem(91px);
                  width: px2rem(91px);
                }
              }

            }
          }
          .gift_box_bg2{
            background-image: url("./img/light2.png");
          }
          .chance_num{
            font-size: px2rem(16px);
            font-weight: 500;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: px2rem(20px);
            span{
              font-size: px2rem(20px);
              color: #FF4600;
              padding: 0 px2rem(4px);
            }
          }
        }
      }
      .act_box{
        margin: px2rem(60px) px2rem(20px) 0;
        width: px2rem(335px);
        background: #008670;
        border-radius: px2rem(8px);
        position: relative;
        padding-top: px2rem(36px);
        .act_tit{
          position: absolute;
          top: px2rem(-20px);
          left: 50%;
          transform: translateX(-50%);
          img{
            height: px2rem(39px);
          }
        }
        .chance_item{
          padding: px2rem(4px) px2rem(12px) px2rem(18px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: px2rem(16px);
          .chance_left{
            width: 75%;
            .task_tit{
              font-size: px2rem(14px);
              font-weight: bold;
              color: #FFFFFF;
            }
            .task_tips{
              margin-top: px2rem(8px);
              font-size: px2rem(12px);
              font-weight: bold;
              color: #8FCBC2;
            }
          }
          .chance_right{
            .task_btn{
              width: px2rem(50px);
              height: px2rem(24px);
              background: #FFD70F;
              border-radius: px2rem(6px);
              font-size: px2rem(12px);
              font-weight: bold;
              color: #993A00;
              line-height: px2rem(24px);
              text-align: center;
            }
            .task_rate{
              font-size: px2rem(12px);
              font-weight: bold;
              color: #8FCBC2;
              margin-top: px2rem(5px);
              text-align: center;
            }
          }
        }
        .rule_text{
          padding: 0 px2rem(12px) px2rem(3px);
          font-size: px2rem(14px);
          font-weight: 500;
          color: #FFFFFF;
          line-height: px2rem(20px);
          p{
            margin-bottom: px2rem(10px);
          }
        }
      }
    }

  }
  #shade_box,#shade_box1{
    width: 100%;
    height: 100%;
    position: fixed;
    //display: flex;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: none;
    text-align: center;
    justify-content: center;
    align-items: center;
  }
  #shade_box{
    .shade-con{
      background-image: url("./img/award_bg.png");
      background-size: cover;
      background-repeat: no-repeat;
      width: px2rem(258px);
      height: px2rem(263px);
      display: flex;
      flex-direction: column;
      align-items: center;
      .img-wrap{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: px2rem(60px);
        color: #FFFFFF;
        font-weight: 500;
        .award_image{
          height: px2rem(90px);
          width: px2rem(90px);
          line-height: px2rem(90px);
          background-color: #ffffff;
          border-radius: px2rem(6px);
          img{
            max-height: px2rem(90px);
            max-width: px2rem(90px);

          }
        }

        .award-name{
          margin-top: px2rem(6px);
          font-size: px2rem(16px);
          line-height: px2rem(22px);
        }
        //.award-coin{
        //  font-size: px2rem(14px);
        //  line-height: px2rem(20px);
        //}
      }
      .get-btn{
        margin-top: px2rem(16px);
        width: px2rem(150px);
        height: px2rem(34px);
        background: #FFD70F;
        border-radius: px2rem(17px);
        text-align: center;
        font-size: px2rem(14px);
        font-weight: bold;
        color: #993A00;
        line-height: px2rem(34px);
      }
    }
  }
  #shade_box1{
    //display: flex;
    .verify_con{
      width: px2rem(320px);
      height: px2rem(160px);
      background: #FFFFFF;
      border-radius: px2rem(12px);
      .verify_text{
        font-size: px2rem(18px);
        font-weight: bold;
        color: #333333;
        line-height: px2rem(25px);
        padding: px2rem(40px) 0;
        text-align: center;
      }
      .verify_btn{
        display: flex;
        align-items: center;
        height: px2rem(55px);
        background: #FAFAFA;
        border-radius: 0 0 px2rem(12px) px2rem(12px);
        font-size: px2rem(18px);
        font-weight: bold;
        color: #999999;
        line-height: px2rem(55px);
        div{
          width: 50%;
        }
        .verify_ok{
          color: #5A57F7;
          border-left: px2rem(1px) solid #EAEAEA;
        }
      }
    }
  }
  #tips{
    position: fixed;
    top: 50%;
    left: 50%;
    //display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    max-width: 70%;
    padding: px2rem(12px) px2rem(15px);
    color: #fff;
    font-size: px2rem(14px);
    white-space: pre-wrap;
    text-align: center;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: px2rem(8px);
    transform: translate3d(-50%, -50%, 0);
    display: none;
  }

</style>
