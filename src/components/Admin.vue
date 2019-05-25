<template scope='scope'>
<div class="hello">
    <!--      Mutil Function Menu           -->
    <div class="bg"></div>
    <el-col :span="14" :offset="5">
        <el-tabs type="border-card">
            <!--      Calendar          -->
            <el-tab-pane>
                <span slot="label"><font-awesome-icon icon="calendar"/> Dashboard</span>
                 <vue-event-calendar
                    :events="appointments">
                    <template slot-scope="props">
                    <div v-for="(event, index) in props.showEvents" class="event-item">
                        <!--
                        <el-col :span="6">
                                <div class="highlight">
                                    {{event.Professional[0].first_name}}
                                    {{event.Professional[0].last_name}}
                                </div>
                        </el-col>
                        -->
                            <el-row style="margin-top:5px" >
                                <el-col :span="6">
                                    <div class="light">
                                    {{event.date | formatDate }}
                                    </div>
                                </el-col>
                                <el-col :span="6">
                                    <div class="light">
                                        {{event.start_time}}:00-{{event.end_time}}:00
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row style="height:auto" class='title' >
                                <el-col :span="12">
                                    <el-popover
                                    placement="left-start"
                                    title="Professional Information"
                                    width="200"
                                    trigger="hover"
                                    :content=professionalString(event.Professional[0])>
                                        <div slot="reference" class="highlight">
                                            <font-awesome-icon 
                                            style="color:#8b9099"
                                            icon="user-tie" />
                                            {{event.Professional[0].first_name}}
                                            {{event.Professional[0].last_name}}
                                        </div>
                                    </el-popover>
                                </el-col>
                                <el-col :span="12">
                                    <el-popover
                                    placement="right-start"
                                    title="Customer Information"
                                    width="200"
                                    trigger="hover"
                                    :content=customerString(event.User[0])>
                                    <div slot="reference" class="highlight">
                                        <font-awesome-icon 
                                        style="color:#7aa9f4"
                                        icon="user" />
                                        {{event.User[0].first_name}}
                                        {{event.User[0].last_name}}
                                    </div>
                                  </el-popover>
                                </el-col>
                            </el-row>
                        <el-row class='content'>
                                <el-col :span="18">
                                    <div class="message">
                                        {{event.message}}
                                    </div>
                                </el-col>
                        </el-row>
                    </div>
                </template>
                </vue-event-calendar>
            <!--      Schedule    -->
            </el-tab-pane>
            <el-tab-pane label="Add Health-Care Professional">
                 <span slot="label">
                    <i class="el-icon-edit"></i> New Professional
                </span>
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
import moment from 'moment'
export default {
    name: 'hello',
    data() {
        return {
            user: '',
            username: '',
            appointments:[],
        }
    },
    mounted() {
        api.getApps().then(({data}) => {
            // load appointments data
            this.appointments = data
            this.appointments.forEach(element => {
                element.date = moment(element.date).format('YYYY/MM/DD')
                element.title = ""
            });
        }).catch((err) => {
            console.log(err);
        })
    },
    beforeDestroy: function(){
        console.log('DESTROYYYY!!!')
    },
    components: {
        Professional
    },
    methods: {
        handler(event) {
            this.$store.dispatch('UserLogout')
        },
        professionalString(Professional) {
            return "Email: " + Professional.email + "\n" 
            + "Type: " +  Professional.type + "\n"
            + "Charge: $" + Professional.charge +"\n"
        },
        customerString(Customer){
            return "Email: " + Customer.email + "\n"
            + "Number: " + Customer.number
        },
    }
}
</script>

<style scoped>

.bg {
    background-color: yellow;
    width: 108vw;
    height: 108vh;
    position: absolute;
    top: -4vh;
    left: -4vw;
    background-image: url("../assets/bg.png");
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
}


.light{
    color: #a5a7aa;
    font-size: 13px;
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