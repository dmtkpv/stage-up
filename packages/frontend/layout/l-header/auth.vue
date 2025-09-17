<!--
    Styles
-->

<style lang="scss">

    .l-header_auth {

        display: flex;
        gap: 16px;

        @include lg-md {
            .l-header_icon { display: none }
        }

        @include sm {
            .ui-button, .link { display: none }
        }

    }

</style>



<!--
    Template
-->

<template>

    <div class="l-header_auth t6">

        <header-icon
            :icon="IconLgUser"
            @click="click('auth-login')"
        />

        <button class="link w6" @click="click('auth-register')">
            {{ t('REGISTER') }}
        </button>

        <ui-button
            :text="t('LOGIN')"
            type="secondary"
            @click="click('auth-login')"
        />

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useAuthClick, useText } from '#root/global/composables.js'
    import { UiButton } from '#root/global/components.js'
    import { IconLgUser } from '#root/global/icons.js'
    import HeaderIcon from './icon.vue'

    const t = useText('l-header');
    const click = useAuthClick();

</script>