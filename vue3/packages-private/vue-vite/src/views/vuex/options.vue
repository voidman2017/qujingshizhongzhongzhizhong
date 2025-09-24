<template>
  <div>
    <p>theme: {{ theme }}</p>
    <p>theme1: {{ theme1 }}</p>
    <p>theme2: {{ theme2 }}</p>
    <p>theme3: {{ theme3 }}</p>
    <p>theme4: {{ theme4 }}</p>
    <p>theme5: {{ theme5 }}</p>
    <p>theme6: {{ theme6 }}</p>
    <p>themeClass1: {{ themeClass1 }}</p>
    <p>themeClass2: {{ themeClass2 }}</p>
    <p>themeClass3: {{ themeClass3 }}</p>
    <button @click="fetchTheme">获取主题</button>
    <button @click="fetchTheme2">获取主题</button>
    <button @click="setThemeWithParams">设置主题</button>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      prefix: 'common',
    }
  },
  computed: {
    themeClass1() {
      return this.$store.getters['common/getThemeClass']
    },
    ...mapGetters({
      themeClass2: 'common/getThemeClass',
    }),
    ...mapGetters('common', {
      themeClass3: 'getThemeClass',
    }),
    ...mapState({
      theme1: state => state.common.theme,
      theme2: 'common.theme',
      theme3(state) {
        return this.prefix + '-' + state.common.theme
      },
    }),
    ...mapState('common', {
      theme4: state => state.theme,
      theme5: 'theme',
      theme6(state) {
        return this.prefix + '-' + state.theme
      },
    }),
    ...mapState('common', ['theme']),
  },
  methods: {
    async fetchTheme() {
      await this.$store.dispatch('common/fetchTheme')
    },
    ...mapActions({
      fetchTheme2: 'common/fetchTheme',
    }),
    ...mapMutations({
      setTheme: 'common/changeTheme',
    }),
    setThemeWithParams() {
      this.setTheme({
        type: 'light',
      })
    },
  },
}
</script>    