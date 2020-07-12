<template>
  <div>
    <span v-if="isFirefox">Detect Firefox</span>
    <span v-else>Not Detect Browser</span>
  </div>
</template>

<script>
  export default {
    computed: {
      isFirefox() {
        return this.$nuxt.$device.db.browser.name === 'Firefox';
      }
    }
  };
</script>
