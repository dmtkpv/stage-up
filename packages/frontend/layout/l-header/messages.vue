<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <header-icon
        :icon="IconLgMessage"
        :count="count"
        :to="{ name: 'account-rooms' }"
    />
</template>



<!--
    Scripts
-->

<script setup>

    import { IconLgMessage } from '#root/global/icons.js'
    import HeaderIcon from './icon.vue'

    const props = defineProps({
        count: Number
    })

</script>