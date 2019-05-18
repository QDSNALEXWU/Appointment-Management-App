<template lang="html">
  <div class="">
    <el-col :span="14" :offset="5">
    <!-- FORM  --> 
    <el-form :model="registerValidateForm" ref="registerValidateForm">
          
        <!-- *********** A Name *************** -->
        <el-form-item
        >   
        <el-col :span="11">
                <el-form-item
                    prop="firstName"
                    :rules="rules.firstName"
                >   
                    <el-input
                        v-model="registerValidateForm.firstName" 
                        placeholder="First Name"
                    >   
                    </el-input>
                </el-form-item> 
        </el-col>
        <el-col :span="11" :offset="2">
                <el-form-item
                    prop="lastName"
                    :rules="rules.lastName">  
                    <el-input
                    v-model="registerValidateForm.lastName" 
                    placeholder="Last Name">   
                    </el-input>
                </el-form-item> 
        </el-col>
        </el-form-item> 
        
        <!-- *********** Professional Type Name & Hourly Rate ***********-->
        <el-form-item>
            <el-col :span="11">
                <el-form-item
                    prop="professionalType"
                    :rules="rules.professionalType">
                    <el-select class="select" 
                        v-model="registerValidateForm.professionalType" 
                        placeholder="Professional type">
                        <el-option label="Podiatrist" value="podiatrist"></el-option>
                        <el-option label="Naturopath" value="naturopath"></el-option>
                        <el-option label="Chiropractor " value="chiropractor "></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset="2">
                <el-form-item
                    prop="charge"
                    :rules="rules.charge"
                >
                    <el-input
                    v-model.number="registerValidateForm.charge" 
                    placeholder="Hourly Rate"
                    >   
                    </el-input>
                </el-form-item>
            </el-col>
        </el-form-item>

        <!-- *********** Email Address *********** -->
        <el-form-item
            prop="email"
            :rules="rules.email">
          <el-input
             v-model="registerValidateForm.email" 
            placeholder="Email Address"
            >   
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
            registerValidateForm: {
                email: '',
                firstName: '',
                lastName:'',
                charge: '',
                professionalType: '',
            },
            rules: {
                email: [{
                        required: true,
                        message: 'Please enter email address',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Please enter a valid email address',
                        trigger: 'change'
                    }
                ],
                firstName: [{
                        required: true,
                        message: 'Please enter your first name',
                        trigger: 'blur'
                    },
                ],
                lastName: [{
                        required: true,
                        message: 'Please enter your last name',
                        trigger: 'blur'
                    },
                ],
                professionalType: [{
                        required: true,
                        message: 'Please select professional type',
                        trigger: 'change'
                    },
                ],
                charge: [{
                        type: 'number',
                        message: 'Rate must be a number',
                    },
                ]
            }
        }
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let opt = this.registerValidateForm;
                    api.addPro(opt).then(({
                        data
                    }) => {
                        console.log(data)
                        
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: `Add Professional Successfuly`
                            })
                            //this.$router.go(0)
                            //this.$router.push('/login')
                        } else {
                            this.$message({
                                type: 'warning',
                                message: 'Professional already exists'
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