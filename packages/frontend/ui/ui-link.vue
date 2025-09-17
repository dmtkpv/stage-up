<!--
    Styles
-->

<style lang="scss">

    .ui-link {

        display: flex;
        align-items: center;

        svg {
            margin-left: .4em;
        }

    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="ui-link link">
        <span>{{ text }}</span>
        <ui-icon :value="IconSmNext" />
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { UiDynamic, UiIcon } from '#root/global/components.js'
    import { IconSmNext } from '#root/global/icons.js'

    const props = defineProps({
        text: {
            type: String,
            required: true
        }
    })

</script>