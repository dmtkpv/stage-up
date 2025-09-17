<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <m-alert v-bind="props" cancel />
</template>



<!--
    Scripts
-->

<script setup>

    import { useAttrs } from 'vue'
    import { useText } from '#root/global/composables.js'
    import { MAlert } from '#root/global/components.js'

    const t = useText('m-confirm');
    const attrs = useAttrs();

    const props = Object.assign({
        heading: t('HEADING'),
        message: t('MESSAGE'),
        button: t('BUTTON'),
    }, attrs)

</script>