<template lang="html">
  <div class="">
    <el-row>
      <el-col :span="5" :offset="10">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="Log in" name="first">
            <el-col >
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
                    <el-button @click="resetForm('dynamicValidateForm')">Reset</el-button>
              </el-form>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="Sign up" name="second">
            <Register></Register>
          </el-tab-pane>
      </el-tabs>
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
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 登录
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
                                message: '账号不存在'
                            })
                        }
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: '登录成功'
                            })
                            this.$store.dispatch('UserLogin', data.token)
                            this.$store.dispatch('UserName', data.email)
                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '密码错误'
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
.el-col {
    // margin-bottom:
}
</style>
