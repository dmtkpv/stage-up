<!--
    Styles
-->

<style lang="scss">

    

</style>



<!--
    Template
-->

<template>
    <div class="promo tile">

        <div class="promo_half">
            <p class="h3">{{ t('TITLE') }}</p>
            <p class="promo_note" v-html="t('NOTE')" />
            <div class="row">
                <div class="promo_cell" v-html="t('CELL1')" />
                <div class="promo_cell" v-html="t('CELL2')" />
            </div>
        </div>

        <div class="promo_half">
            <div class="promo_subtitle">
                <div class="promo_subtitle_icon">
                    <ui-icon :value="IconSmPremium" type="custom" />
                </div>
                <p class="promo_subtitle_text" v-html="t('SUBTITLE')" />
            </div>
            <ul class="promo_list list">
                <li v-for="feature in features">
                    <div class="list_icon"><ui-icon :value="IconSmCheck" /></div>
                    <p v-html="feature.text" />
                </li>
            </ul>
            <ui-button
                :text="t('BUTTON')"
                :to="{ name: 'account-upgrade' }"
            />
        </div>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText, useFeatures } from '#root/global/composables.js'
    import { IconSmCheck, IconSmPremium } from '#root/global/icons.js'
    import { UiIcon, UiButton } from '#root/global/components.js'

    const t = useText('promo-upgrade');
    const features = useFeatures('upgrade')

</script>