<!--
    Styles
-->

<style lang="scss">

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

        <ui-tabs :tabs="tabs" v-model="query.archived" />

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <unit-room
                v-for="room in list"
                class="tile"
                heading="h2"
                :key="room.id"
                :value="room"
                :to="{ name: 'account-room', params: { id: room.id } }"
            />
        </l-list>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { usePreload, useText, useMeta, useIoReload, useQuery } from '#root/global/composables.js'
    import { LHeading, LList, ISelect, UiTabs, UnitRoom } from '#root/global/components.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'unit-room',
            'unit-application',
            'route-account-rooms'
        ],

        lists: [
            'education_fields',
            'education_levels'
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const read = qs.boolean(to.query.read);
            const archived = qs.boolean(to.query.archived);

            return {
                limit,
                query: { page, read, archived },
                list: api('account-rooms-list').fetch({ limit, page, read, archived }),
                count: api('account-rooms-count').fetch({ read, archived }),
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-rooms')
    const data = usePreload();
    const query = useQuery(data, ['read', 'archived']);

    const filter = [
        { text: t('FILTER_ALL'), value: undefined },
        { text: t('FILTER_READ'), value: true },
        { text: t('FILTER_UNREAD'), value: false }
    ]

    const tabs = [
        { text: t('TAB_INBOX'), value: undefined },
        { text: t('TAB_ARCHIVED'), value: true },
    ]

    useMeta();
    useIoReload();



</script>