<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          PCR Tools
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-blue-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          {{ $t('navBar') }}
        </q-item-label>
        <NavItem
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-item-label>
          <LangSwitcher></LangSwitcher>
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import NavItem from 'components/NavItem.vue'
import nav from '@/config/nav.js'
import LangSwitcher from 'components/LangSwitcher'

export default {
  name: 'MainLayout',
  components: { NavItem, LangSwitcher },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: nav
    }
  }
}
</script>
