<template>
  <h1>{{t('setup.title')}}</h1>

  <StartPlayer/>
  <DifficultyLevel/>

  <button class="btn btn-primary btn-lg mt-4" @click="setupBot()">
    {{t('setupBot.title')}}
  </button>

  <FooterButtons endGameButtonType="abortGame"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStateStore } from '@/store/state'
import FooterButtons from '@/components/structure/FooterButtons.vue'
import DifficultyLevel from '@/components/setup/DifficultyLevel.vue'
import StartPlayer from '@/components/setup/StartPlayer.vue'

export default defineComponent({
  name: 'SetupGame',
  components: {
    FooterButtons,
    StartPlayer,
    DifficultyLevel
  },
  setup() {
    const { t } = useI18n()
    const state = useStateStore()

    return { t, state }
  },
  methods: {
    setupBot() : void {
      this.$router.push('/setupBot')
    }
  }
})
</script>
