<!--
    Styles
-->

<style lang="scss">

    .ui-actions {
        position: relative;

        & > button {
            padding: 2px;
        }

        .ui-item {
            white-space: nowrap;
        }

    }

</style>


<!--
    Template
-->

<template>
    <div class="ui-actions">

        <button @click.prevent="active = !active">
            <ui-icon class="ui-actions_icon" :value="IconSmMenu" type="md" />
        </button>

        <ui-tooltip v-model="active">
            <template v-for="item in value" :key="item.value">
                <ui-item
                    v-if="!item.hidden"
                    :text="item.text"
                    @click.prevent="trigger(item.value)"
                />
            </template>
        </ui-tooltip>

    </div>
</template>


<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useModal, useAttrEmit } from '#root/global/composables.js'
    import { UiIcon, UiTooltip, UiItem } from '#root/global/components.js'
    import { IconSmMenu } from '#root/global/icons.js'

    const emit = defineEmits([
        'action'
    ])

    const props = defineProps([
        'value'
    ])

    const emitAttr = useAttrEmit();
    const active = ref(false);

    function trigger (name) {
        emit('action', name);
        emitAttr(name);
    }

    defineExpose({
        active
    })

</script>