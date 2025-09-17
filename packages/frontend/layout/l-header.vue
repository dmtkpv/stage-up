<!--
    Styles
-->

<style lang="scss">

    .l-header {



        // --------------------
        // Common
        // --------------------

        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: $header;
        background: $white;
        box-shadow: $shadow;
        display: flex;
        align-items: center;

        @include lg-md {
            gap: 24px;
            padding: 0 $padding-x;
        }

        @include sm {
            gap: 16px;
            padding: 0 12px;
        }



        // --------------------
        // Menu
        // --------------------

        &_menu {
            position: relative;
            height: $header;
            display: flex;
            align-items: center;
        }



    }

</style>



<!--
    Template
-->

<template>
    <header class="l-header">

        <header-logo />
        <header-language />
        <header-auth v-if="!user.id" />

        <template v-else>
            <header-favorites />
            <header-notifications :list="notifications" :count="countNotifications" />
            <header-messages :count="countMessages" />
            <header-account />
        </template>

    </header>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { createQueue } from '@this/shared/utils.js'
    import { useUser, useAPI, useIo } from '#root/global/composables.js'
    import HeaderLogo from './l-header/logo.vue'
    import HeaderLanguage from './l-header/language.vue'
    import HeaderAuth from './l-header/auth.vue'
    import HeaderFavorites from './l-header/favorites.vue'
    import HeaderMessages from './l-header/messages.vue'
    import HeaderNotifications from './l-header/notifications.vue'
    import HeaderAccount from './l-header/account.vue'



    // -------------------
    // Data
    // -------------------

    const user = useUser();
    const io = useIo();
    const notifications = ref([]);
    const countNotifications = ref(0);
    const countMessages = ref(0);

    const apis = [
        {
            endpoint: useAPI('account-messages-list'),
            params: { notification: true, limit: 5 }
        },
        {
            endpoint: useAPI('account-messages-count'),
            params: { notification: true, read: false }
        },
        {
            endpoint: useAPI('account-messages-count'),
            params: { read: false }
        }
    ]

    const load = createQueue(async () => {
        const requests = apis.map(({ endpoint, params }) => endpoint.fetch(params));
        const data = await Promise.all(requests);
        notifications.value = data[0];
        countNotifications.value = data[1];
        countMessages.value = data[2];
    }, 5000)



    // -------------------
    // Hooks
    // -------------------

    apis.forEach(({ endpoint }) => {
        endpoint.onFetch(({ config }) => {
            config.uncanceled = true
        })
    })



    // -------------------
    // Io
    // -------------------

    if (io.socket.connected) load();
    else io.on('connect', load)
    io.on('update', load)



</script>