<!--
    Template
-->

<template>
    <ui-tag v-if="tag" :type="tag.type" :text="tag.text" />
</template>


<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { UiTag } from '#root/global/components.js'

    const props = defineProps([
        'value',
        'styles'
    ])

    const tag = computed(() => {
        return props.styles.find(style => style.value === props.value)
    })

</script>