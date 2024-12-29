<template>
  <h1 class="mb-3">{{t('endOfGame.title')}}</h1>

  <p v-html="t('endOfGame.finalScore')"></p>

  <p v-html="t('endOfGame.scoreTable')"></p>
  <div class="row">
    <div class="col-10 offset-1 col-sm-8 col-md-6 col-lg-4">
      <table class="table table">
        <tbody>
          <tr>
            <th scope="row">★</th>
            <td>100 VP</td>
          </tr>
          <tr>
            <th scope="row">★★</th>
            <td>120 VP</td>
          </tr>
          <tr>
            <th scope="row">★★★</th>
            <td>150 VP</td>
          </tr>
          <tr>
            <th scope="row">★★★★</th>
            <td>175 VP</td>
          </tr>
          <tr>
            <th scope="row">★★★★★</th>
            <td>200 VP</td>
          </tr>
          <tr>
            <th scope="row">★★★★★★</th>
            <td>225 VP</td>
          </tr>
          <tr>
            <th scope="row">★★★★★★★</th>
            <td>250 VP</td>
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
    }
  }
})
</script>
