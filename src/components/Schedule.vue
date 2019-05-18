<template lang="html">
  <div class="">
    <el-col :span="14" :offset="5">
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
                                :label="item.first_name + ' ' + item.last_name + '  ' + item.charge +'$/hr'" 
                                :value="item.email">   
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
                </el-form-item>
            </el-col>
            <el-col 
            class="timepicker"
            :offset='1'
            :span="7">
                <el-form-item
                    prop="endTime"
                    :rules="rules.endTime">
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
          <el-button type="primary" @click="submitForm('registerValidateForm')">Submit</el-button>
          <el-button @click="resetForm('registerValidateForm')">Reset</el-button>
    </el-form>
    </el-col>
  </div>
</template>
<script>
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'hello',
    data() {
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
                        type: 'date',
                        required: true,
                        message: 'Please select a date',
                        trigger: 'change'
                    },
                ],
                startTime: [{
                        required: true,
                        message: 'Please select startTime',
                        trigger: 'change'
                    },
                ],
                endTime: [{
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
    methods: {
        // chenge a doc type
        typeChange(data) {
            this.professionals = this.allprofessionals.filter(i => i.type == data.toLowerCase());
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // copy object
                    let opt = JSON.parse(JSON.stringify(this.registerValidateForm));
                    opt.professional = 
                        this.allprofessionals.filter(i => i.email == this.registerValidateForm.professional)[0];  
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