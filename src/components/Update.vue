<template lang="html">
  <div class="">
    <el-col :span="14" :offset="5">
        <el-form :model="registerValidateForm" ref="registerValidateForm">
        <!-- Name -->
        <el-form-item prop="Name">
            <el-col :span="11">
                <el-form-item        
                    prop="firstName"
                    :rules="rules.firstName">
                    <el-input
                        v-model="registerValidateForm.firstName"
                        :disabled="formdisabled"  
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
                        :disabled="formdisabled"  
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
                :disabled="formdisabled" 
                placeholder="Home Address">   
            </el-input>
        </el-form-item>
        
        <!-- Number -->
        <el-form-item 
            prop="number"
            :rules="rules.number">
            <el-input
                v-model="registerValidateForm.number"
                :disabled="formdisabled" 
                placeholder="Contact Number">   
            </el-input>
        </el-form-item>
          
        <!-- Email -->
        <el-form-item
            prop="email"
            :rules="rules.email">
            <el-input
                placeholder="Email"
                :disabled="formdisabled" 
                v-model="registerValidateForm.email">   
            </el-input>
        </el-form-item>
        
        <!-- Passward -->
        <el-form-item
          prop="password"
          v-if="changePassowrd"
          :rules = "rules.password">
            <el-input 
                type="password"
                placeholder="New Password"
                :disabled="formdisabled" 
                v-model="registerValidateForm.password">
            </el-input>
        </el-form-item>
        
        <el-form-item
          prop="checkPass"
          :rules = "rules.checkPass"
          v-if="changePassowrd"
          >
            <el-input 
                type="password"
                placeholder="Confirm New Password"
                :disabled="formdisabled" 
                v-model="registerValidateForm.checkPass">    
            </el-input>
          </el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm('registerValidateForm')"
            :disabled="formdisabled"
            >Submit
          </el-button>
          <el-button
             type="warning"
            :disabled="formdisabled" 
            @click="changePass">
            Change Password
            </el-button>
          <el-button type="success" @click="editForm">Edit</el-button>
          <el-button type="danger" @click="logout">Log out</el-button>
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
        let validatePass1 = (rule, value, callback) => {
            let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
            if (!reg.test(value)) {
                callback(new Error('6-16 character limits，needs to contain digits, letters and special characters'))
            } else {
                callback()
            }
        };
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
            formdisabled: true,
            changePassowrd: false,
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
    mounted: function () {
        this.registerValidateForm.email = this.user.email
        this.registerValidateForm.firstName = this.user.first_name
        this.registerValidateForm.lastName = this.user.last_name
        this.registerValidateForm.address = this.user.address
        this.registerValidateForm.number = this.user.number
    },
    props: {
        user:Object
    },
    methods: {
        editForm() {
            this.formdisabled = !this.formdisabled;
        },
        changePass() {
            this.changePassowrd = !this.changePassowrd
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let opt = this.registerValidateForm;
                    api.updateUser(opt).then(({
                        data
                    }) => {
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: `Profile Updated`
                            })
                            this.formdisabled = true;
                            //this.$router.go(0)
                            //this.$router.push('/login')
                        } else {
                            this.$message({
                                type: 'warning',
                                message: 'Update Failure'
                            })
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    console.log('Error Submit !!');
                    return false;
                }
            });
        },
        logout() {
             this.$confirm('This will log you out. Continue?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('UserLogout')
                if (!this.$store.state.token) {
                    this.$router.push('/login')
                    this.$message({
                        type: 'success',
                        message: `See you next time, ${this.user.first_name}`
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: 'Log out fail'
                    })
                }

            }).catch(() => {
                this.$message({
                type: 'info',
                message: 'Log out canceled'});
            });
        },
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