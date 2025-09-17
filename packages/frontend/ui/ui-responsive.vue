<!--
    Template
-->

<template>
    <component :is="config.component" v-bind="config.options">
        <slot />
    </component>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, onMounted, ref } from "vue";
    import { getProp } from '#root/global/utils.js'

    const props = defineProps([
        'default',
        'lg',
        'md',
        'sm'
    ])

    const md = getProp('--md');
    const sm = getProp('--sm');
    const size = ref('lg');

    const config = computed(() => {
        return props[size.value] || props.default;
    })

    function setSize () {
        if (window.innerWidth > md) size.value = 'lg';
        else if (window.innerWidth > sm) size.value = 'md';
        else size.value = 'sm';
    }

    onMounted(() => {
        window.addEventListener('resize', setSize)
        setSize();
    })

</script>