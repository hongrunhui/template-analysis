<template>
	<div>
		<codemirror
		:value="code"
		:options="option"
		@change="change"
		>
		</codemirror>
	</div>
</template>

<script>
import { codemirror } from "vue-codemirror-lite"
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/vue/vue.js';
import 'codemirror/mode/javascript/javascript.js';

// require hint addon for javacript
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint.js';
export default {
    name: 'CodeMirror',
	data () {
		return {
			// code: 'const str = "hello world"',
			option: {
				mode: this.mode || 'javascript',
				tabSize: 2,
				lineNumbers: true,
				lineWrapping: true,
				extraKeys: {'Ctrl-Space': 'autocomplete'},
			}
		};
	},
	props: {
		code: String,
		mode: String,
		change: Function
	},
	components: {
		codemirror
	},
	computed: {

	},
	methods: {
		
	},
	updated: function() {
		console.log('hi');
	}
}
</script>