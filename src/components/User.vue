<template scope='scope'>
<div class="hello">
    <!--      Mutil Function Menu           -->
    <div class="bg"></div>
    <el-col :span="14" :offset="5">
        <el-tabs class="window" type="border-card">
            <!--      Calendar          -->
            <el-tab-pane v-loading="loading">
                <span slot="label"><font-awesome-icon icon="calendar"/> Dashboard</span>
                 <vue-event-calendar
                    :events="appointments"
                    >
                    <template slot-scope="props">
                    <div v-for="(event, index) in props.showEvents" class="event-item">
                        <el-row style="height:auto" class='title'>
                            <el-col :span="6">
                                <el-popover
                                    placement="right-start"
                                    title="Professional Information"
                                    width="200"
                                    trigger="hover"
                                    :content=professionalString(event.Professional[0])>
                                    <div 
                                        slot="reference" 
                                        class="highlight">
                                        {{event.Professional[0].first_name}}
                                        {{event.Professional[0].last_name}}
                                    </div>
                                </el-popover>
                            </el-col>
                        <el-col :offset='6' :span="6">
                            <div class="light">
                                {{event.date}}
                            </div>
                        </el-col>
                            <el-col :span="6">
                                <div class="light">
                                    {{event.start_time}}:00-{{event.end_time}}:00
                                </div>
                        </el-col>
                        </el-row>
                            <el-row class='content'>
                                <el-col :span="18">
                                    <div class="message">
                                        {{event.message}}
                                    </div>
                                </el-col>
                            <el-col :span="6">
                                <div class="button" >
                                    <el-button
                                        @click=cancelEvent(event)
                                        size="small" 
                                        type="danger">Cancel
                                    </el-button>
                                </div>
                            </el-col>    
                            </el-row>
                    </div>
                </template>
                </vue-event-calendar>
            <!--      Schedule    -->
            </el-tab-pane>
            <el-tab-pane >
                <span slot="label">
                    <i class="el-icon-edit"></i> Book
                </span>
                <Schedule :user="user"></Schedule>
            </el-tab-pane>
            <!--      Update Profile    -->
            <el-tab-pane 
            label="">
                <span slot="label"><i class="el-icon-setting"></i>
                </span>
                <template v-if="userDataLoaded">
                    <Update :user="user"></Update>
                 </template>
            </el-tab-pane>
        </el-tabs>
    </el-col>
    <!--      TABLE CONTENT START           -->
    <el-col class="Calendar" :span="12" :offset="6">
       
    </el-col>
    <!--      TABLE CONTENT FINISH             -->
    <!-- <el-button type="primary" @click="logout()">Sign Out</el-button>-->
    <!-- v-for
    <transition-group name="list-complete" tag="ul">
        <li v-for="(item, index) in user" :key="item._id" class="list-complete-item">
            {{ index+1 }}. {{ item.email }}
            <el-button type="" @click="del_user(index)">删除</el-button>
        </li>
    </transition-group>
    -->
</div>
</template>

<script>
import * as types from '../store/types'
import api from '../axios'
import Schedule from '@/components/Schedule.vue'
import Update from '@/components/Update.vue'
import moment from 'moment'
export default {
    name: 'hello',
    data() {
        return {
            msg: 'Welcome to Vue-login',
            username: '',
            user: {},
            userDataLoaded:false,
            activeIndex: '1',
            appointments: [],
            loading: false,
        }
    },
    mounted() {
        this.username = localStorage.getItem('username')
        this.get_User().then(({data}) => {
            if (data) {
                this.user = data
                this.userDataLoaded = true
                this.get_Apps()
            }
        })
    },
    components: {
        Schedule,
        Update
    },
    methods: {
        get_Apps(){
            api.getAppsbyUserID(this.user._id).then(({data}) => {
                // load appointments data
                this.formatDate(data)
            }).catch((err) => {
                console.log(err);
            })
        },
        formatDate(data) {
            this.appointments = data
            this.appointments.forEach(element => {
                element.date = moment(element.date).format('YYYY/MM/DD')
                element.title = ""
            });
        },
        /**
         * Cancel An Appointment
         * @param  {number} key
         * @return
         */
        cancelEvent(key) {
            this.$confirm('This will cancel the appointment. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                // del appointment
                let opt = {
                    id: key._id
                }
                this.loading = true
                api.delApp(opt).then(({
                        data
                    }) => {
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: `Appointment Canceled`
                            })
                            this.get_Apps()
                        } else {
                            this.$message({
                                type: 'warning',
                                message: 'system error'
                            })
                        }
                        this.loading = false
                    }).catch((err) => {
                        console.log(err);
                    })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: 'Delete canceled'});
            });
        },
        /**
         * [get_User data]
         * @return
         */
        get_User() {
            return api.getUserByEmail(this.username)
        },
        professionalString(Professional) {
            return "Email: " + Professional.email + "\n" 
            + "Type: " +  Professional.type + "\n" 
            + "Charge: $" + Professional.charge +"/h"
        },
    }
}
</script>

<style>
.el-tabs__nav {
    width: 100% !important;
}

.el-tabs__item {
    float: left;
}

.el-tabs__item:nth-child(3) {
    float: right;
}

</style>


<style scoped>

.bg {
    background-color: yellow;
    width: 108vw;
    height: 108vh;
    position: absolute;
    top: -4vh;
    left: -4vw;
    background-image: url("../assets/1.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: -1;
    filter: blur(10px);
}

.window{
    background-color: rgba(255,255,255); /* Black w/opacity/see-through */
}

h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    /*display: inline-block;*/
    margin: 10px 0;
}

a {
    color: #42b983;
}

.list-complete-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
}

.list-complete-enter,
.list-complete-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.list-complete-leave-active {
    position: absolute;
}

.title{
    border-bottom: 10px solid grey;
    height: auto;
}

.light{
    color: #a5a7aa;
    font-size: 13px;
}

.highlight{

}

.message{
    font-size: 15px;
    float: left;
    margin-top: 5px;
}

.button {
    margin-top: 5px;
}

.Calendar {
    margin-bottom: 40px;
}

.Menu {
    background: white;
    border-bottom: 1px solid #cacdd1;
    margin-bottom: 30px;
    margin-top: -40px;
}

.el-menu-item:hover { 
  background-color: white;
}
</style>
