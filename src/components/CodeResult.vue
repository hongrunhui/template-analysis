<template>
    <div>
        <div v-for="item in message" :class="item.change ? 'item-box gray' : 'item-box'">
            <div v-if="item.type === 'replace'">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        类型：<code>{{item.type}}</code>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        正则：
                        <pre class="pre">{{item.re}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        替换字符串：
                        
                        <pre class="pre">{{item.cb}}</pre>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        原始字符串：
                        <pre class="pre">{{item.string}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        转换后的字符串：
                        <pre class="pre">{{item.result}}</pre>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type === 'split'">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        类型：<code>{{item.type}}</code>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        第一个参数：
                        <pre class="pre">{{item.re}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        第二个参数（有可能没有）：
                        <pre class="pre">{{item.cb}}</pre>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        原始字符串：
                        <pre class="pre">{{item.string}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        转换后的字符串：
                        <pre class="pre">{{item.result}}</pre>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type === 'join'">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        类型：<code>{{item.type}}</code>
                        </div>
                    </el-col>
                
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        参数：
                        <pre class="pre">{{item.re}}</pre>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        原始字符串：
                        <pre class="pre">{{item.string}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        转换后的字符串：
                        <pre class="pre">{{item.result}}</pre>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type === 'exec'">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        类型：<code>{{item.type}}</code>
                        </div>
                    </el-col>
                
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        参数：
                        <pre class="pre">{{item.re}}</pre>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        原始字符串：
                        <pre class="pre">{{item.string}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        转换后的字符串：
                        <pre class="pre">{{item.result}}</pre>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type === 'match'">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        类型：<code>{{item.type}}</code>
                        </div>
                    </el-col>
                
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        参数：
                        <pre class="pre">{{item.re}}</pre>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        原始字符串：
                        <pre class="pre">{{item.string}}</pre>
                        </div>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple-light">
                        转换后的字符串：
                        <pre class="pre">{{item.result}}</pre>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div v-if="item.type === 'Function'">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="grid-content bg-purple">
                        类型：<code>{{item.type}}</code>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <div class="grid-content bg-purple-light">
                        转换后的字符串：
                        <pre class="pre">{{item.result}}</pre>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        console.log(this);
        return {};
    },
    computed: {

    },
    props: {
        message: Array
    }
}
</script>
<style>
.item-box {

}
.item-box.gray {
    background-color: rgba(139, 239, 200, 0.2);
    
}
</style>

