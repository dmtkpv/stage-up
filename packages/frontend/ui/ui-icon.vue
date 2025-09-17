<!--
    Styles
-->

<style lang="scss">

    .ui-icon {

        &._lg {
            height: 24px;
        }

        &._md {
            height: 20px;
        }

        &._sm {
            height: 12px;
        }

    }

</style>



<!--
    Template
-->

<template>
    <component class="ui-icon" :class="type" :is="value" />
</template>



<!--
    Options
-->

<script>
    const types = ['lg', 'md', 'sm', 'custom']
</script>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'

    const props = defineProps({
        value: {
            required: true,
            type: Object
        },
        type: {
            validator: value => types.includes(value)
        }
    })

    const type = computed(() => {
        if (props.type === 'custom') return;
        const type = props.type || props.value.__name.split('-').shift();
        if (types.includes(type)) return `_${type}`;
    })

</script>

