<template>
  <p>{{ greeting }} world!</p>
</template>

<script>
export default {
    data: function(){
        return {
            greeting: "Hello"
        };
    }
};
</script>

<style>
p {
    font-size: 2em;
    text-align: center;
}
</style>