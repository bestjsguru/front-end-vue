<template>
  <div id="app">
    <div class="banner">
      <img
        src="https://vuejs.org/images/logo.png"
        width="100"
        alt="vue"
        class="logo"
      />
      <h1>Vue Project</h1>
    </div>

    <div class="client-list">
      <ClientList />
    </div>
  </div>
</template>

<script>
  import ClientList from './client_list/ClientList.vue'
  
  export default {
    name: 'app',
    components: {
      ClientList
    }
}
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>
<style src='bootstrap/dist/css/bootstrap.css'> </style>
<style src='bootstrap-vue/dist/bootstrap-vue.css'></style>
<style src='font-awesome/css/font-awesome.css'></style>

<!-- Global CSS -->
<style>
  code {
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    font-size: 0.9em;
    white-space: pre-wrap;
    color: #2c3e50;
  }

  code::before, code::after {
    content: '`';
  }
</style>

<!-- Scoped component css -->
<!-- It only affect current component -->
<style scoped>
  #app {
    text-align: center;
  }

  #app h1 {
    color: #2c3e50;
    font-weight: 300;
    margin: 0;
  }

  .banner {
    height: 220px;
    background-color: #f6f6f6;
    padding: 50px 10px;
  }

  .logo {
    animation: spin 4s 1s infinite linear
  }

  .client-list {
    margin-top: 30px;
  }

  @keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
  }
</style>
