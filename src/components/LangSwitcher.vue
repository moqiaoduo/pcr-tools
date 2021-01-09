<template>
  <!-- ...... -->
  <q-select
    v-model="lang"
    :options="langOptions"
    label="Language"
    dense
    borderless
    emit-value
    map-options
    options-dense
    style="margin: 15px"
  />
  <!-- ...... -->
</template>

<script>
export default {
  name: 'LangSwitcher',
  data () {
    return {
      lang: this.$i18n.locale,
      langOptions: [
        { value: 'zh-hans', label: '简体中文' },
        { value: 'en-us', label: 'English' }
      ]
    }
  },
  watch: {
    lang (lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>
