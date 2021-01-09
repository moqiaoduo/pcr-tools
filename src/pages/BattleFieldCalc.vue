<template>
  <q-page class="q-pa-md">
    <h2 class="text-center">{{ $t('bfCalcTitle') }}</h2>
    <q-form @submit="calc" @reset="reset" class="q-gutter-md">
      <q-input
        filled
        type="number"
        v-model.number="coin"
        :label="$t('bfCoin')"
        :hint="$t('bfCoinDescription')"
        lazy-rules
        :rules="[ val => !$tools.isEmpty(val) && val >= 0 || $t('numberShouldOverOrEqual0') ]"
      />
      <q-input
        filled
        type="number"
        v-model.number="price"
        :label="$t('bfShopPrice')"
        :hint="$t('bfShopPriceDescription')"
        lazy-rules
        :rules="[ val => !$tools.isEmpty(val) && val > 0 || $t('numberShouldOver0') ]"
      />
      <q-input
        filled
        type="number"
        v-model.number="alreadyUse"
        :label="$t('bfAlreadyUseCount')"
        :hint="$t('bfAlreadyUseCountDescription')"
        lazy-rules
        :rules="[ val => !$tools.isEmpty(val) && val >= 0 || $t('numberShouldOverOrEqual0') ]"
      />
      <q-toggle v-model="divide" :label="$t('bfDivide')" />
      <q-input
        filled
        type="number"
        v-model.number="divideDays"
        v-if="divide"
        :label="$t('bfDivideDays')"
        :hint="$t('bfDivideDescription')"
        :rules="[
          val => $tools.isEmpty(val) || val > 0 || $t('numberShouldOver0'),
          val => divide && (!$tools.isEmpty(divideNum) || !$tools.isEmpty(val)) || $t('bfDivideRequired'),
          val => $tools.isEmpty(divideNum) || $tools.isEmpty(val) || $t('bfDivideTip')
          ]"
      />
      <q-input
        filled
        type="number"
        v-model.number="divideNum"
        v-if="divide"
        :label="$t('bfDivideNum')"
        :hint="$t('bfDivideTip')"
        :rules="[
          val => $tools.isEmpty(val) || val > 0 || $t('numberShouldOver0'),
          val => divide && (!$tools.isEmpty(divideDays) || !$tools.isEmpty(val)) || $t('bfDivideRequired'),
          val => $tools.isEmpty(divideDays) || $tools.isEmpty(val) || $t('bfDivideTip')
          ]"
      />
      <div>
        <q-btn :label="$t('calc')" type="submit" color="primary"/>
        <q-btn :label="$t('reset')" type="reset" color="primary" flat class="q-ml-sm"/>
      </div>
    </q-form>
    <q-markup-table separator="vertical" flat bordered class="q-mt-md">
      <thead>
      <tr>
        <th class="text-right">{{ $t('Item') }}</th>
        <th class="text-left">{{ $t('Value') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="text-right">{{ $t('bfCountBuy') }}</td>
        <td class="text-left">{{ countBuy }}</td>
      </tr>
      <tr>
        <td class="text-right">{{ $t('bfRestCoin') }}</td>
        <td class="text-left">{{ restCoin }}</td>
      </tr>
      <tr>
        <td class="text-right">{{ $t('bfRefreshCoin') }}</td>
        <td class="text-left">{{ refreshCoin }}</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
const refreshCoin = [10, 50, 100, 200, 500]

export default {
  name: 'BattleFieldCalc',
  data () {
    return {
      coin: null,
      price: null,
      alreadyUse: 0,
      countBuy: 0,
      restCoin: 0,
      refreshCoin: 0,
      divide: false,
      divideDays: null,
      divideNum: null
    }
  },
  methods: {
    calc () {
      let result = {
        countBuy: 0,
        restCoin: 0,
        refreshCoinCount: 0
      }
      if (this.divide) {
        if (this.$tools.isEmpty(this.divideNum)) {
          const dayCoin = Math.floor(this.coin / this.divideDays)
          const restSCoin = this.coin - dayCoin * this.divideDays
          for (let day = 0; day < this.divideDays; day++) {
            const { countBuy, restCoin, refreshCoinCount } = this.singleCalc(dayCoin)
            console.log(`Day ${day} Buy Count: ${countBuy}`)
            result.countBuy += countBuy
            result.restCoin += restCoin
            result.refreshCoinCount += refreshCoinCount
          }
          result.restCoin += restSCoin
        } else {
          const dayCoin = this.divideNum
          const days = Math.floor(this.coin / dayCoin)
          for (let day = 0; day < days; day++) {
            const { countBuy, restCoin, refreshCoinCount } = this.singleCalc(dayCoin)
            result.countBuy += countBuy
            result.restCoin += restCoin
            result.refreshCoinCount += refreshCoinCount
          }
          const { countBuy, restCoin, refreshCoinCount } = this.singleCalc(this.coin % dayCoin)
          result.countBuy += countBuy
          result.restCoin += restCoin
          result.refreshCoinCount += refreshCoinCount
        }
      } else {
        result = this.singleCalc(this.coin)
      }
      this.countBuy = result.countBuy
      this.restCoin = result.restCoin
      this.refreshCoin = result.refreshCoinCount
    },
    singleCalc (restCoin) {
      let alreadyUse = this.alreadyUse - 2
      if (alreadyUse < 0) alreadyUse = 0
      let levelC = Math.floor(alreadyUse / 3) // 当前第几阶梯
      if (levelC > 4) levelC = 4
      let thisUseCount = (this.alreadyUse - 1) % 3
      let enableRefresh = this.alreadyUse > 0
      let countBuy = 0 // 可购买次数统计
      let level = levelC
      let refreshCoinCount = 0
      while (true) {
        let testCoin, testRefreshCoin
        for (let j = thisUseCount; j < 3; j++) {
          testRefreshCoin = (enableRefresh ? refreshCoin[level] : 0)
          testCoin = restCoin - this.price - testRefreshCoin
          if (testCoin < 0) break
          restCoin = testCoin
          refreshCoinCount += testRefreshCoin
          ++countBuy
          enableRefresh = true
        }
        if (testCoin < 0) break
        thisUseCount = 0
        level++
        if (level > 4) level = 4
      }
      return {
        countBuy,
        restCoin,
        refreshCoinCount
      }
    },
    reset () {
      this.coin = null
      this.alreadyUse = 0
      this.countBuy = 0
      this.price = null
      this.restCoin = 0
      this.refreshCoin = 0
      this.divide = false
      this.divideDays = null
      this.divideNum = null
    }
  },
  watch: {
    coin (newValue) {
      this.coin = parseInt(newValue)
    }
  }
}
</script>

<style scoped>

</style>
