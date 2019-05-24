<template lang="html">
  <div>
    <el-form :model="registerValidateForm" ref="registerValidateForm">
        <!-- Name -->
        <el-form-item prop="Name">
            <el-col :span="11">
                <el-form-item        
                    prop="firstName"
                    :rules="rules.firstName">
                    <el-input
                        v-model="registerValidateForm.firstName"  
                        placeholder="First Name">   
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
        
        <!-- Address -->
        <el-form-item 
            prop="address"
            :rules="rules.address">
            <el-input
                v-model="registerValidateForm.address"
                placeholder="Home Address">   
            </el-input>
        </el-form-item>
        
        <!-- Number -->
        <el-form-item 
            prop="number"
            :rules="rules.number">
            <el-input
                v-model="registerValidateForm.number"
                placeholder="Contact Number">   
            </el-input>
        </el-form-item>
          
        <!-- Email -->
        <el-form-item
            prop="email"
            :rules="rules.email">
            <el-input
                placeholder="Email"
                v-model="registerValidateForm.email">   
            </el-input>
        </el-form-item>
        
        <!-- Passward -->
        <el-form-item
          prop="password"
          :rules = "rules.password">
            <el-input 
                type="password"
                placeholder="Password" 
                v-model="registerValidateForm.password">
            </el-input>
        </el-form-item>
        
        <el-form-item
          prop="checkPass"
          :rules = "rules.checkPass"
          >
            <el-input 
                type="password"
                placeholder="Confirm Password"
                v-model="registerValidateForm.checkPass">    
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="submitForm('registerValidateForm')">Sign up</el-button>
          <el-button type="danger" @click="resetForm('registerValidateForm')">Reset</el-button>
    </el-form>
  </div>
</template>
·
<script>
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'login',
    data() {
        // passward requirments
        let validatePass1 = (rule, value, callback) => {
            // 6-16 digits, at least two out of digits, letters and special chars, no space
            let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
            if (!reg.test(value)) {
                callback(new Error('6-16 characters with digits, letters and special characters'))
            } else {
                callback()
            }
        };
        // check if passwords are identical 
        let validatePass2 = (rule, value, callback) => {
            value === '' ? callback(new Error('Please confirm your password')) :
                value !== this.registerValidateForm.password ? callback(new Error('Inconsistent password !')) :
                callback()
        };
        return {
            registerValidateForm: {
                email: '',
                password: '',
                checkPass: '',
                firstName: '',
                lastName:'',
                address:'',
                number:''
            },
            rules: {
                email: [{
                        required: true,
                        message: 'Please enter email address',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Please enter valid email address',
                        trigger: 'blur'
                    }
                ],
                password: [{
                        required: true,
                        message: 'Please enter password',
                        trigger: 'blur'
                    },
                    {
                        validator: validatePass1,
                        trigger: 'blur'
                    }
                ],
                checkPass: [{
                        required: true,
                        message: 'Please confirm password',
                        trigger: 'blur'
                    },
                    {
                        validator: validatePass2,
                        trigger: 'blur'
                    }
                ],
                firstName: [{
                        required: true,
                        message: 'Please enter first name',
                        trigger: 'blur'
                    },
                ],
                lastName: [{
                        required: true,
                        message: 'Please enter last name',
                        trigger: 'blur'
                    },
                ],
                address: [{
                        required: true,
                        message: 'Please enter address',
                        trigger: 'blur'
                    },
                ],
                number: [{
                        required: true,
                        message: 'Please enter phone number',
                        trigger: 'blur'
                    },
                ],
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
                    api.userRegister(opt).then(({
                        data
                    }) => {
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: `Register success，Please log in`
                            })
                            //  go to login page
                            setTimeout(() =>{ 
                                this.$router.go(0)
                                this.$router.push('/login') 
                            }, 1000);
                        } else {
                            this.$message({
                                type: 'warning',
                                message: 'Account already registered'
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

</style>
