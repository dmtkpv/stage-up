<!--
    Styles
-->

<style lang="scss">

    .i-place {

        position: relative;

        .ui-tooltip {
            width: 100%;
        }

        &_clear {
            &:hover {
                color: $blue;
            }
        }

    }

</style>


<!--
    Template
-->

<template>
    <div class="i-place">


        <!-- input -->

        <i-input
            ref="input"
            type="text"
            :icon="IconLgLocation"
            :placeholder="placeholder"
            v-model="query"
            @focusout="tooltip = false"
            @focusin="tooltip = true">

            <template #after>
                <a v-if="query" @mousedown="clear" class="i-place_clear">
                    <ui-icon :value="IconSmClose" />
                </a>
            </template>

        </i-input>


        <!-- tooltip -->

        <ui-tooltip :model-value="tooltip" v-if="items.length">
            <ui-item
                v-for="item in items"
                :key="item.value"
                :text="item.text"
                @click="select(item)"
            />
        </ui-tooltip>


    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, watch } from 'vue'
    import { clone } from '#root/global/utils.js'
    import { useSSR, useAPI } from '#root/global/composables.js'
    import { IInput, UiIcon, UiTooltip, UiItem } from '#root/global/components.js'
    import { IconSmClose, IconLgLocation } from '#root/global/icons.js'



    // -----------------
    // Data
    // -----------------

    const emit = defineEmits([
        'change'
    ])

    const props = defineProps({
        modelValue: String,
        placeholder: String,
        types: Array
    })

    const search = useAPI('places-list');
    const place = useAPI('places-item');
    const ssr = useSSR();
    const query = ref(props.modelValue);
    const items = ref([]);
    const input = ref(null);
    const tooltip = ref(false);
    const output = {};



    // -----------------
    // Handlers
    // -----------------

    function clear () {
        search.cancel();
        place.cancel();
        query.value = '';
        items.value = [];
        emit('change', {});
    }

    function select ({ value, text }) {
        place.cancel();
        output.place_id = value;
        output.text = text;
        query.value = text;
        place.quiet(value, { fields: ['geometry'] });
    }



    // -----------------
    // Hooks
    // -----------------

    search.onSuccess(data => {
        items.value = data;
    })

    place.onSuccess(({ geometry }) => {
        output.geometry = geometry;
        emit('change', clone(output));
    });

    watch(query, input => {
        search.cancel();
        !ssr && input && search.quiet({ input, types: props.types });
    })

    watch(() => props.modelValue, (value) => {
        query.value = value || '';
    })

</script>