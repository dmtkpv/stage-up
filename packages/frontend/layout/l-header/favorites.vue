<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <header-icon :icon="IconLgBookmark" :to="{ name }" />
</template>


<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useUser } from '#root/global/composables.js'
    import { IconLgBookmark } from '#root/global/icons.js'
    import HeaderIcon from './icon.vue'

    const user = useUser();
    const name = computed(() => user.role === 'candidate' ? 'account-favorite-jobs' : 'account-favorite-candidates')

</script>