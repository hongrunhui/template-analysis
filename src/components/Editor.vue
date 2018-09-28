<template>
    <div class="editor-wrap">
        <div class="select-options">
            <el-select @change="selectChange" v-model="templateType" placeholder="请选择">
                <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="code-wrap">
            <el-row :gutter="10">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <CodeMirror 
                        mode="javascript"
                        :change="changeTpl"
                        :code="tplData[this.templateType].for.tpl"/>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <CodeMirror 
                        :change="changeUse"
                        :code="tplData[this.templateType].for.use"/>
                </el-col>
            </el-row>
        </div>
        <div class="button-wrap">
            <el-row>
                <el-button type="primary" v-on:click="analysis">分析模板</el-button>
            </el-row>
        </div>
        <div>
            <div>{{templateType}}</div>
            <div id="results">这里放的是最终的渲染结果</div>
        </div>
        <div class="result-wrap" v-if="showRes">
            <div v-if="message && message.length" class="item-box header">
                总共{{message.length}}步
            </div>
            <CodeResult :message="message"/>
        </div>
    </div>
</template>
<script>
import CodeMirror from './CodeMirror.vue';
import CodeResult from './CodeResult.vue';
import replaceMethods from '../js/replaceMethods';
export default {
    name: 'Editor',
    data () {
        return {
            message: window.__DATA__ || [],
            tplData: window.tplData,
            showLoading: false,
            templateType: 'baiduTemplate',
            showRes: true,
            selectOptions: [
                {
                    value: 'baiduTemplate',
                    label: 'baiduTemplate'
                },
                {
                    value: 'doT',
                    label: 'doT'
                },
                {
                    value: 'jqueryTmpl',
                    label: 'jqueryTmpl'
                },
                {
                    value: 'template',
                    label: 'template'
                },
                {
                    value: 'mustache',
                    label: 'mustache'
                },
                {
                    value: 'ejs',
                    label: 'ejs'
                },
                {
                    value: 'artTemplate',
                    label: 'artTemplate'
                },
                {
                    value: 'riot',
                    label: 'riot'
                }
            ]
        };
    },
    props: {
        hi: String
    },
    updated() {
    },
    methods: {
        selectChange(e) {
            this.showRes = false;
        },
        changeTpl(code) {
            let tpl = this.tplData[this.templateType];
            this.tplData[this.templateType].for.tpl = code;
        },
        changeUse(code) {
            let tpl = this.tplData[this.templateType];
            this.tplData[this.templateType].for.use = code;
        },
        error(text) {
            this.$notify.error({
                title: '错误',
                message: text
            });
        },
        analysis(e) {
            try {
                this.showRes = true;
                let use = this.tplData[this.templateType].for.use;
                let tpl = this.tplData[this.templateType].for.tpl;
                let templateEl = document.getElementById('template');
                if (!templateEl) {
                    let scriptEl = document.createElement('script');
                    scriptEl.id = 'template';
                    scriptEl.innerHTML = this.tplData[this.templateType].for.tpl;
                    document.body.appendChild(scriptEl);
                }
                else {
                    templateEl.innerHTML = tpl;
                }
                let fn = new Function('fun', use);
                replaceMethods();
                setTimeout(function() {
                    var pres = document.getElementsByClassName('pre');
                    [].forEach.call(pres, function(item, i) {
                        item.classList.add('prettyprint', 'linenums');
                    });
                    window.prettyPrint();
                }, 500);
                fn();
                this.message = window.__DATA__;
                window.__DATA__ = [];
            }
            catch(e) {
                console.log(e);
                this.error(String(e));
            }
        }
    },
    components: {
        CodeMirror,
        CodeResult
    }
}
</script>
<style>
.editor-wrap {
    padding: 15px;
}
.select-options {
    text-align: center;
}
.code-wrap {
    padding: 20px 0;
}
.button-wrap {
    text-align: center;
    padding-top: 20px;
}
#results,
.item-box {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    margin: 20px 0;
    padding: 10px;
}
.item-box.header {
    text-align: center;
    background-color: #409EFF;
    color: #fff;
}
.change {
    color: #fff;
    padding: 10px;
}
.change.red {
    background-color: #F56C6C;
}
.change.green {
    background-color: #67C23A;
}
</style>