<!--
    Styles
-->

<style lang="scss">

    .i-checkbox {

        cursor: pointer;

        &._disabled {
            pointer-events: none;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="i-input box" :class="{ _disabled: disabled }" @click="emit('update:modelValue', !modelValue)">
        <ui-switch :active="modelValue" />
        <span>{{ label }}</span>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { UiSwitch } from '#root/global/components.js'

    const emit = defineEmits([
        'update:modelValue'
    ])

    defineProps([
        'label',
        'modelValue',
        'disabled'
    ])
    
</script>