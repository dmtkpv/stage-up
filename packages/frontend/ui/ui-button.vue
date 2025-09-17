<!--
    Styles
-->

<style lang="scss">

    .ui-button {



        // --------------------
        // Common
        // --------------------

        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3em;
        gap: .4em;
        padding: 0 1em;
        border-radius: $radius;
        font-weight: $w6;
        border: 1px solid transparent;
        white-space: nowrap;



        // --------------------
        // SVG
        // --------------------

        &_spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1.5em;
            height: 1.5em;
            margin: -0.75em 0 0 -0.75em;
        }

        &_icon {
            width: 1.5em;
            height: 1.5em;
        }



        // --------------------
        // Loading
        // --------------------

        &._loading {
            pointer-events: none;
        }



        // --------------------
        // Icon
        // --------------------

        &._icon {
            padding: 0;
            width: 3em;
        }

        &._icon &_icon {
            margin: 0;
        }



        // --------------------
        // Types
        // --------------------

        &._disabled {
            pointer-events: none;
        }

        &._primary {
            @extend %blue;
            &:hover { @extend %blue-dark }
            &._disabled { @extend %grey }
        }

        &._secondary {
            color: $blue;
            background: $white;
            &:not(._disabled) { border-color: $blue; }
            &:hover { @extend %blue }
            &._disabled { @extend %grey }
            &._loading { @extend %blue }
        }

        &._default {
            border: 1px solid currentColor;
            &:hover { color: $blue; }
        }

        &._light {
            background: $white;
            border: 1px solid $grey-light;
            font-weight: $w4;
            svg { color: $blue; }
            &:hover { color: $blue; }
        }

        &._success {
            @extend %green;
            &._disabled { @extend %grey }
        }



        // --------------------
        // Animation
        // --------------------

        transition: .2s ease;
        transition-property: background-color, color;

        & > * {
            transition: opacity .2s
        }

        &:not(._loading) > *:not(&_spinner) {
            transition-delay: .2s;
        }

        &:not(._loading) > &_spinner {
            opacity: 0;
        }

        &._loading > *:not(&_spinner) {
            opacity: 0;
        }

        &._loading > &_spinner {
            transition-delay: .2s;
        }



    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="ui-button" :class="[type, icon, loading, disabled]" :type="typeAttr">

        <ui-spinner class="ui-button_spinner" />

        <ui-icon
            v-if="props.icon"
            class="ui-button_icon"
            type="custom"
            :value="props.icon"
         />

        <span v-if="props.text">{{ props.text }}</span>

    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { UiDynamic, UiSpinner, UiIcon } from '#root/global/components.js'

    const props = defineProps({
        text: String,
        icon: Object,
        loading: Boolean,
        submit: Boolean,
        disabled: Boolean,
        type: {
            default: 'primary'
        }
    })

    const type = computed(() => {
        return '_' + props.type;
    })

    const typeAttr = computed(() => {
        if (props.submit) return 'submit'
    })

    const loading = computed(() => {
        return props.loading && '_loading';
    })

    const disabled = computed(() => {
        return props.disabled && '_disabled';
    })

    const icon = computed(() => {
        return props.icon && !props.text && '_icon';
    })

</script>