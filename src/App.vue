<template>
  <div id="view">
    <Header />
    <Editor hi="hi"/>
  </div>
</template>

<script>
import aaa from './components/List.vue';
import Header from './components/Header.vue';
import Editor from './components/Editor.vue';

export default {
  name: 'app',
  components: {
    aaa,
    Header,
    Editor
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
