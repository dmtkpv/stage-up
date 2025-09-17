<!--
    Styles
-->

<style lang="scss" scoped>


</style>



<!--
    Template
-->

<template>
    <section>

        <l-heading>
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <template #controls>
                <i-select v-model="query.read" :list="filter" />
            </template>
        </l-heading>

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-notification
                class="tile"
                heading="h2"
                v-for="notification in list"
                :key="notification.id"
                :value="notification" />
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useRouter } from 'vue-router'
    import { usePreload, useText, useMeta, useIoReload, useQuery } from '#root/global/composables.js'
    import { LHeading, LList, ISelect, UnitNotification } from '#root/global/components.js'



    // ------------------
    // Preload
    // ------------------

    defineOptions({

        texts: [
            'route-account-notifications'
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const read = qs.boolean(to.query.read);
            const notification = true;

            return {
                limit,
                query: { page, read },
                list: api('account-messages-list').fetch({ limit, page, read, notification }),
                count: api('account-messages-count').fetch({ read, notification }),
            }

        }
    })



    // ------------------
    // Data
    // ------------------

    const t = useText('route-account-notifications')
    const router = useRouter();
    const data = usePreload();
    const query = useQuery(data, ['read'])

    const filter = [
        { text: t('FILTER_ALL'), value: undefined },
        { text: t('FILTER_READ'), value: true },
        { text: t('FILTER_UNREAD'), value: false }
    ]

    useMeta();
    useIoReload();



</script>