<!--
    Styles
-->

<style lang="scss">


</style>



<!--
    Template
-->

<template>
    <div class="ui-error alert _error">
        {{ errors.message(value, form) }}
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useErrors } from '#root/global/composables.js'

    const props = defineProps([
        'value',
        'form'
    ])

    const errors = useErrors();

</script>