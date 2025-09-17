<!--
    Styles
-->

<style lang="scss">

    .l-heading {

        margin-bottom: $gap;



        // -----------------
        // Controls
        // -----------------

        &_controls {

            display: flex;
            align-items: center;
            gap: 12px;

            .ui-button span {
                font-size: $t6;
            }

            .i-input {
                background: $white;
                box-shadow: $shadow;
            }

        }



        // -----------------
        // Desktop
        // -----------------

        @include lg-md {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 12px;
        }



        // -----------------
        // Mobile
        // -----------------

        @include sm {

            &_title {
                margin-bottom: 12px;
            }

            &_primary {
                order: -1;
                margin-right: auto;
            }

        }



    }
</style>



<!--
    Template
-->

<template>
    <div class="l-heading">
        <div class="l-heading_title">
            <slot />
        </div>
        <div class="l-heading_controls" v-if="slots.controls">
            <slot name="controls" />
        </div>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useSlots } from 'vue'
    const slots = useSlots();

</script>