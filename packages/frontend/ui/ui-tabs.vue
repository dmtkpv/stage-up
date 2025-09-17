<!--
    Styles
-->

<style lang="scss">

    .ui-tabs {

        display: flex;
        gap: 16px;
        margin-bottom: $gap;

        button {
            font-weight: $w5;
            color: $grey-dark;
            &._active {
                color: $black;
                text-decoration: underline;
            }
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="ui-tabs">
        <button
            v-for="tab in tabs"
            v-text="tab.text"
            :key="tab.value"
            :class="{ _active: tab.value === modelValue }"
            @click="emit('update:modelValue', tab.value)"
        />
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    const emit = defineEmits([
        'update:modelValue'
    ])

    defineProps([
        'tabs',
        'modelValue'
    ])

</script>