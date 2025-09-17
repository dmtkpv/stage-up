<!--
    Styles
-->

<style lang="scss">

    .l-sidebar { z-index: 1 }
    .l-header { z-index: 2 }
    .l-modal { z-index: 4 }
    .l-loader { z-index: 3 }
    .l-toasts { z-index: 5 }

</style>



<!--
    Template
-->

<template>
    <l-header />
    <l-loader />
    <l-error v-if="state.error" :value="state.error" />
    <router-view v-else />
    <l-sidebar />
    <l-modal />
    <l-toasts />
</template>



<!--
    Scripts
-->

<script setup>

    import { watch, computed } from 'vue'
    import { useState, useOverlay } from '#root/global/composables.js'
    import { LHeader, LLoader, LError, LSidebar, LModal, LToasts } from '#root/global/components.js'

    const modal = useOverlay('modal');
    const sidebar = useOverlay('sidebar');
    const state = useState();

    const scrollable = computed(() => {
        return !modal.active && !sidebar.active
    })

    watch(scrollable, value => {
        document.body.style.overflow = value ? '' : 'hidden'
    })

</script>