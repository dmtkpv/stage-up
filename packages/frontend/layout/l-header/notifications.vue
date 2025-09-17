<!--
    Styles
-->

<style lang="scss">



    // --------------------
    // Menu
    // --------------------

    .ZRA6q6 {

        padding: 0 !important;
        width: 280px;

        .unit-notification {
            padding: 16px;
        }

        .link {
            display: block;
            padding: 16px;
            text-align: center;
        }

    }



</style>



<!--
    Template
-->

<template>
    <div class="l-header_menu">

        <header-icon
            :icon="IconLgBell"
            :count="count"
            @click="click"
        />

        <ui-responsive v-model="active" v-bind="responsive" class="ZRA6q6">
            <unit-notification v-for="notification in list" heading="p" :key="notification.id" :value="notification" />
            <router-link v-if="list.length > 4" :to="{ name: 'account-notifications' }" class="link">{{ t('VIEW_MORE') }}</router-link>
        </ui-responsive>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useText } from '#root/global/composables.js'
    import { UiResponsive, UiTooltip, UiSidebar, UnitNotification } from '#root/global/components.js'
    import { IconLgBell } from '#root/global/icons.js'
    import HeaderIcon from './icon.vue'



    // -------------------
    // Data
    // -------------------

    const props = defineProps({
        list: Array,
        count: Number
    })

    const t = useText('l-header');
    const router = useRouter();
    const active = ref(false);

    const responsive = {
        default: {
            component: UiTooltip
        },
        sm: {
            component: UiSidebar,
            options: {
                position: 'right'
            }
        }
    }



    // -------------------
    // Actions
    // -------------------

    function click () {
        if (props.list.length) active.value = !active.value;
        else router.push({ name: 'account-notifications' });
    }



</script>