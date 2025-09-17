<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <ui-button
        type="default"
        :icon="IconLgPhone"
        :text="phone ? value : null"
        :href="phone ? `tel:${value}` : null"
        @click="phone = true"
    />
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { UiButton } from '#root/global/components.js'
    import { IconLgPhone } from '#root/global/icons.js'

    defineProps([
        'value'
    ])

    const phone = ref(false);

</script>