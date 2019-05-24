<template lang="html">
  <div class="">
    <el-col :span="18" :offset="3">
    <el-form :model="registerValidateForm" ref="registerValidateForm">
          <!-- Professional Type Name-->
          <el-form-item>
            <el-col :span="11">
                <el-form-item
                    prop="professionalType"
                    :rules="rules.professionalType">
                    <el-select class="select"
                        @change='typeChange'
                        v-model="registerValidateForm.professionalType" 
                        placeholder="Please select professional type">
                        <el-option label="Podiatrist" value="podiatrist"></el-option>
                        <el-option label="Naturopath" value="naturopath"></el-option>
                        <el-option label="Chiropractor " value="chiropractor "></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
                <el-form-item
                    prop="professional"
                    :rules="rules.professional">
                    <el-select class="select" 
                        v-model="registerValidateForm.professional"
                        placeholder="Please select professional">
                            <el-option 
                                v-for="item in professionals"
                                :key="item.email"
                                :label="item.first_name + ' ' + item.last_name + '  ' + '$'+ item.charge +'/hour' " 
                                :value="item._id">   
                            </el-option>
                        <!--
                        <el-option label="Tom $30/h" value="tom"></el-option>
                        <el-option label="Jake $40/h" value="jake"></el-option>
                        -->
                    </el-select>
                </el-form-item>
            </el-col>
          </el-form-item>

          <!-- Date Time -->
          <el-form-item required>
            <el-col :span="8">
                <el-form-item 
                    prop="date"
                    :rules="rules.date">
                    <el-date-picker 
                        type="date"
                        @change="selectDate()"
                        :disabled="registerValidateForm.professional==''"
                        placeholder="Pick a date" 
                        v-model="registerValidateForm.date" 
                        style="width: 100%;">        
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col 
            class="timepicker"
            :offset='1'
            :span="7"
            >   
                <el-form-item
                    prop="startTime"
                    :rules="rules.startTime">
                    <el-select 
                        v-model="registerValidateForm.startTime"
                        @change="selectStart(registerValidateForm.startTime)"
                        :disabled="startTimeDisabled"
                        placeholder="Select Start Time">
                        <el-option
                            v-for="item in startTimeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                    <!--
                    <el-time-select
                        style="width: 100%;"
                        placeholder="Start time"
                        v-model="registerValidateForm.startTime"
                        :picker-options="{
                            start: '09:00',
                            step: '01:00',
                            end: '16:00'
                        }">
                    </el-time-select>
                    -->
                </el-form-item>
            </el-col>
            <el-col 
            class="timepicker"
            :offset='1'
            :span="7">
                <el-form-item
                    prop="endTime"
                    :rules="rules.endTime">
                    <el-select 
                        v-model="registerValidateForm.endTime"
                        :disabled="endTimeDisabled"
                        placeholder="Select End Time">
                        <el-option
                            v-for="item in endTimeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                    <!--
                    <el-time-select
                        style="width: 100%;"
                        placeholder="End time"
                        v-model="registerValidateForm.endTime"
                        :picker-options="{
                            start: '10:00',
                            step: '01:00',
                            end: '17:00',
                            minTime: registerValidateForm.startTime
                        }">
                    -->
                    </el-time-select>
                </el-form-item>
            </el-col>
          </el-form-item>
          <!-- Optional Message -->
          <el-form-item
            prop="Name"
          >
            <el-input
                type="textarea"
                :rows="2"
                placeholder="Optional message"
                v-model="registerValidateForm.message">
            </el-input>
          </el-form-item>
          <!--  <TimeSlot></TimeSlot> -->
          <el-button type="primary" @click="submitForm('registerValidateForm')">Submit</el-button>
          <el-button @click="resetForm('registerValidateForm')">Reset</el-button>
    </el-form>
    </el-col>
  </div>
</template>
<script>
import * as types from '../store/types'
import api from '../axios'
import moment from 'moment'
import TimeSlot from '@/components/TimeSlot.vue'
export default {
    name: 'hello',
    data() {
        var validateDate = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('Please select a date'));
            } else if (moment(value).isBefore(moment())) {
                callback(new Error('Please select a date in the future'));
            } else {
                callback();
            }
        };
        return {
            allprofessionals: [],
            professionals: [],
            registerValidateForm: {
                startTime: '',
                endTime:'',
                message:'',
                professional: '',
                date: '',
                //charge: '',
                //professionalType: '',
            },
            startTimeDisabled:true,
            endTimeDisabled: true,
            startTimeOptions: [{
                value: 9,
                label: '9:00 AM',
                disabled:false,
            },{
                value: 10,
                label: '10:00 AM',
                disabled:false
            },{
                value: 11,
                label: '11:00 AM',
                disabled:false
            },{
                value: 12,
                label: '12:00 PM',
                disabled:false
            },{
                value: 13,
                label: '1:00 PM',
                disabled:false
            },{
                value: 14,
                label: '2:00 PM',
                disabled:false
            },{
                value: 15,
                label: '3:00 PM',
                disabled:false
            },{
                value: 16,
                label: '4:00 PM',
                disabled:false
            }],
            endTimeOptions: [{
                value: 10,
                label: '10:00 AM',
                disabled:false
            },{
                value: 11,
                label: '11:00 AM',
                disabled:false
            },{
                value: 12,
                label: '12:00 PM',
                disabled:false
            },{
                value: 13,
                label: '1:00 PM',
                disabled:false
            },{
                value: 14,
                label: '2:00 PM',
                disabled:false
            },{
                value: 15,
                label: '3:00 PM',
                disabled:false
            },{
                value: 16,
                label: '4:00 PM',
                disabled:false
            },{
                value: 17,
                label: '5:00 PM',
                disabled:false
            }],

            rules: {
                professionalType: [{
                        required: true,
                        message: 'Please select professional type',
                        trigger: 'change'
                    },
                ],
                professional: [{
                        required: true,
                        message: 'Please select professional',
                        trigger: 'change'
                    },
                ],
                date: [{
                        validator: validateDate, 
                        trigger: 'change' 
                    }
                ],
                startTime: [{
                        type: 'number',
                        required: true,
                        message: 'Please select startTime',
                        trigger: 'change'
                    },
                ],
                endTime: [{
                        type: 'number',
                        required: true,
                        message: 'Please select endTime',
                        trigger: 'change'
                    },
                ],
            }
        }
    },
    props: {
        user:Object
    },
    mounted: function () {
        api.getPros().then(({
            data
        }) => {
            // load professional data
            this.allprofessionals = data
        }).catch((err) => {
            console.log(err);
        }) 
    },
    components: {
        TimeSlot
    },
    methods: {
        selectStart(data) {
            // disable time earlier than starttime
            // console.log(this.endTimeOptions)
            let stopflag = false
            this.endTimeOptions.forEach(function (time) {
                if(time.value <= data){
                    time.disabled = true
                } else if (time.booked || stopflag) {
                    time.disabled = true
                    stopflag = true
                } else {
                    time.disabled = false
                }
            });
            this.registerValidateForm.endTime = "";
            this.endTimeDisabled = false;
        },
        selectDate() {
            let date = this.registerValidateForm.date
            let professional = this.registerValidateForm.professional
            if(moment(date).isAfter(moment())) {
                let req = {
                    professional: professional,
                    date: date 
                }
                api.getAppsTime(req).then(({
                    data
                }) => {
                    this.disableSlots(data)
                    //console.log(data);
                }).catch((err) => {
                    console.log(err);
                }) 
                //console.log(date,professional)
            }
        },
        disableSlots(data){
            for (var app of data) {
                let start = app.start_time
                let end = app.end_time
                this.endTimeOptions.forEach(function (time) {
                    if(time.value > start && time.value <= end) {
                        time.booked = true
                    } 
                })
                this.startTimeOptions.forEach(function (time) {
                    if(time.value >= start && time.value < end) {
                        time.disabled = true
                    }
                })
            }
            this.startTimeDisabled = false
        },
        // chenge a doc type
        typeChange(data) {
            this.professionals = this.allprofessionals.filter(i => i.type == data.toLowerCase());
            this.registerValidateForm.professional = ""
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let professional = this.allprofessionals.filter(i => i._id == this.registerValidateForm.professional)[0];
                    let cost = professional.charge * (this.registerValidateForm.endTime - this.registerValidateForm.startTime)
                    this.$confirm(`This total cost of the appointment will be $${cost}. Continue?`, 'Warning', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        // copy object
                        let opt = JSON.parse(JSON.stringify(this.registerValidateForm));
                        opt.professional = professional
                        // add user
                        opt.user = this.user
                        api.addApp(opt).then(({
                            data
                        }) => {
                                if (data.success) {
                                    this.$message({
                                        type: 'success',
                                        message: `Appointment Scheduled Successfuly`
                                    })
                                    //  refresh page, go to calander
                                    setTimeout(() =>{ 
                                        this.$router.go(0)
                                        this.$router.push('/') 
                                    }, 1000);
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: 'system error'
                                    })
                                }
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: 'Reservation canceled'});
                    });

                } else {
                    console.log('Error Submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="css">

.select {
    width: 100%;
}

.timepicker {
    display: inline-block;
}

</style>