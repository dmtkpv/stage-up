<!--
    Styles
-->

<style lang="scss">

    .m-location {

        section {
            display: flex;
            flex-direction: column;
            gap: $gap
        }

    }

</style>



<!--
    Template
-->

<template>
    <m-default class="m-location" :title="t('HEADING')" font="4">
        <i-place :placeholder="t('LOCATION_PLACEHOLDER')" @change="onChange" />
        <p>{{ t('DESCRIPTION') }}</p>
    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { MDefault, IPlace } from '#root/global/components.js'
    import { useModal, useText } from '#root/global/composables.js'

    const props = defineProps([
        'onChange'
    ])

    const t = useText('m-location')
    const modal = useModal();

    function onChange (value) {
        props.onChange(value);
        modal.hide();
    }


</script>