<!--
    Styles
-->

<style lang="scss">

    .l-toasts {



        // --------------------
        // Layout
        // --------------------

        $margin: calc($gap / 2);

        position: fixed;
        top: $header;
        right: $margin;
        margin-top: $margin;

        @include lg-md {
            width: 320px;
        }

        @include sm {
            left: $margin;
        }



        // --------------------
        // Item
        // --------------------

        &_item {
            display: flex;
            align-items: flex-start;
            padding: 12px;
            margin-bottom: 8px;
        }

        &_icon {
            flex-shrink: 0;
        }

        &_text {
            flex-grow: 1;
            padding: 0 8px;
        }

        &_close {
            flex-shrink: 0;
            padding: 4px;
            color: $grey-dark;
            svg { width: 16px }
        }



        // --------------------
        // Modifiers
        // --------------------

        &_item._error &_icon {
            color: $red;
        }

        &_item._info &_icon {
            color: $blue;
        }



    }

</style>



<!--
    Template
-->

<template>
    <aside class="l-toasts" v-if="items.length">
        <div
            v-for="(toast, index) in items"
            class="l-toasts_item tile"
            :key="index"
            :class="`_${toast.type}`"
            @mouseenter="toast.stop()"
            @mouseleave="toast.wait()"
        >

            <ui-icon class="l-toasts_icon" :value="IconLgError" />
            <p class="l-toasts_text">{{ toast.text }}</p>
            <button class="l-toasts_close" @click="toast.remove()">
                <ui-icon :value="IconSmClose" type="custom" />
            </button>

        </div>
    </aside>
</template>



<!--
    Scripts
-->

<script setup>

    import { useToasts } from '#root/global/composables.js'
    import { UiIcon } from '#root/global/components.js'
    import { IconSmClose, IconLgError } from '#root/global/icons.js'

    const { items } = useToasts();

</script>