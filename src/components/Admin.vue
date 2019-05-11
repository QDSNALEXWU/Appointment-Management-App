<template scope='scope'>
<div class="hello">
    <!--      Mutil Function Menu           -->
    <el-col :span="14" :offset="5">
        <el-tabs type="border-card">
            <!--      Calendar          -->
            <el-tab-pane>
                <span slot="label">Appointments Requests</span>
                 <vue-event-calendar
                    :title="title"
                    :events="demoEvents">
                    <template slot-scope="props">
                    <div v-for="(event, index) in props.showEvents" class="event-item">
                        <el-row class='title'>
                            <el-col :span="6">
                                <div class="highlight">
                                    {{event.name}}
                                </div>
                            </el-col>
                        <el-col :offset='6' :span="6">
                            <div class="light">
                                {{event.date}}
                            </div>
                        </el-col>
                            <el-col :span="6">
                                <div class="light">
                                    {{event.time}}
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
                                    <el-button  size="small" type="danger">Cancel</el-button>
                                </div>
                            </el-col>    
                            </el-row>
                    </div>
                </template>
                </vue-event-calendar>
            <!--      Schedule    -->
            </el-tab-pane>
            <el-tab-pane label="Add Health-Care Professional">
                <Professional></Professional>
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
/**
 * @author: weakgoldfish
 */
import * as types from '../store/types'
import api from '../axios'
import Professional from '@/components/Professional.vue'
export default {
    name: 'hello',
    data() {
        return {
            msg: 'Welcome to Vue-login',
            user: '',
            username: '',
            title: "All Appointments",
            activeIndex: '1',
            demoEvents: [{
                date: '2016/11/12', // Required
                time: "10-12am",
                name: 'Tom',
                type: 'podiatrist',
                charge:'$30', 
                message:'see you tmr',
            }, {
                date: '2016/11/15', // Required
                time: "12-1pm",
                name: 'Jake',
                type: 'podiatrist',
                charge:'$30', 
                message:'I will be there a little bit late',
            }]
        }
    },
    mounted() {
        this.get_User()
        this.username = localStorage.getItem('username')
    },
    components: {
        Professional
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        get_User() {
            setTimeout(() => {
                api.getUser().then(({
                    data
                }) => {
                    if (data.code == 401) {
                        console.log('token')
                        this.$router.push('/login')
                        this.$store.dispatch('UserLogout')
                        console.log(localStorage.token)
                    } else {
                        this.user = data
                    }
                })
            }, 100)
        },
        logout() {
            this.$store.dispatch('UserLogout')
            if (!this.$store.state.token) {
                this.$router.push('/login')
                this.$message({
                    type: 'success',
                    message: '登出成功'
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '登出失败'
                })
            }
        },
        del_user(id) {
            let opt = {
                id: this.user[id]._id
            };
            api.delUser(opt).then(response => {
                console.log(response)
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.get_User()
            }).catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>

<style scoped>
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