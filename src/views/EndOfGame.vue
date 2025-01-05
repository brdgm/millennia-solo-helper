<template>
  <h1 class="mb-3">{{t('endOfGame.title')}}</h1>

  <p v-html="t('endOfGame.finalScore')"></p>

  <p v-html="t('endOfGame.scoreTable')"></p>
  <div class="row">
    <div class="col-10 offset-1 col-sm-8 col-md-6 col-lg-4">
      <table class="table table">
        <tbody>
          <tr v-for="(vp,index) of starVP" :key="index">
            <th scope="row"><span v-for="star of (index+1)" :key="star">★</span></th>
            <td>{{t(`endOfGame.vp`, {count:vp})}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <FooterButtons :backButtonRouteTo="backButtonRouteTo" endGameButtonType="endGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import { useStateStore } from '@/store/state'

export default defineComponent({
  name: 'EndOfGame',
  components: {
    FooterButtons
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()

    return { t, state }
  },
  computed: {
    backButtonRouteTo() : string {
      return `/round/8/war`
    },
    starVP() : number[] {
      return [100, 120, 150, 175, 200, 225, 250]
    }
  }
})
</script>
