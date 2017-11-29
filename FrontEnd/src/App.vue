<template>
    <div id="app">
        <ons-toolbar id="header">
            <div class="center">断·舍·离</div>
        </ons-toolbar>
        <project-card></project-card>
    </div>
</template>


<script>

import projectList from './components/projectList.vue';

export default {
    name: 'app',
    components: {
        projectCard: projectList,
    },
    data () {
        return {
            carouselIndex: 0,
            items: [
                'http://placekitten.com/g/300/300',
                'http://placekitten.com/g/400/400',
                'http://placekitten.com/g/500/500'
            ]
        };
    }
}
</script>

<style lang="scss">
@import "./scss/common.scss";

#header{
    height: $HEADER-HEIGHT;
    .center{
        line-height: $HEADER-HEIGHT;
        font-size: 30px;
        font-family: "FangSong";
        color: $BASIC-RED;
    }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
