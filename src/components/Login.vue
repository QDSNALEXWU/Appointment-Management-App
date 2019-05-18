<template lang="html">
  <div>
    <div class="bg"></div>
    <el-row>
      <el-col :span="5" :offset="10">
        <el-card shadow="always" class="window">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Log in" name="first">
            <el-col>
              <el-form :model="dynamicValidateForm" ref="dynamicValidateForm">
                    <el-form-item
                      prop="email"
                      :rules="rules.email"
                    >
                      <el-input
                        placeholder="Email"
                        v-model="dynamicValidateForm.email">
                      </el-input>
                    </el-form-item>
                    <el-form-item
                    prop="password"
                    :rules = "rules.password"
                    >
                      <el-input 
                        type="password"
                        placeholder="Password"
                        v-model="dynamicValidateForm.password">
                      </el-input>
                    </el-form-item>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">Log in</el-button>
                    <el-button type="danger" @click="resetForm('dynamicValidateForm')">Reset</el-button>
              </el-form>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Sign up" name="second">
            <Register></Register>
          </el-tab-pane>
      </el-tabs>
      </el-card>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import Register from '@/components/Register.vue'
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'login',
    data() {
        return {
            dynamicValidateForm: {
                email: '',
                password: ''
            },
            activeName: this.$store.state.activeName,
            // 输入校验
            rules: {
                email: [{
                        required: true,
                        message: 'Please enter an email address',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'Please enter an valid email address',
                        trigger: 'blur'
                    }
                ],
                password: {
                    required: true,
                    message: 'Please enter password',
                    trigger: 'blur'
                }
            }
        }
    },
    components: {
        Register
    },
    methods: {
        handleClick(tab, event) {},
        // reset
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // login
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let opt = this.dynamicValidateForm;
                    api.UserLogin(opt).then(({
                        data
                    }) => {
                        console.log(data)
                        if (!data.info) {
                            this.$message({
                                type: 'info',
                                message: 'Account Not Registered'
                            })
                        }
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: 'Login Success'
                            })
                            this.$store.dispatch('UserLogin', data.token)
                            this.$store.dispatch('UserName', data.email)
                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            })
                        } else {
                            this.$message({
                                type: 'warning',
                                message: 'Wrong Password or Email'
                            })
                        }
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

<style lang="scss">
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
    filter: blur(20px);
}

.window{
    background-color: rgba(0,0,0, 0.4); /* Black w/opacity/see-through */
}

.window input[type]{
    background-color: rgba(0,0,0, 0.4);
    color:#CCCDCD;
}

</style>
