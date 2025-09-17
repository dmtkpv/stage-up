<!--
    Styles
-->

<style lang="scss">

    .item-stats {

        display: flex;
        align-items: center;
        padding: 16px;

        &_icon {
            width: 64px;
            height: 64px;
            padding: 16px;
            border-radius: $radius;
            margin-right: 16px;
        }

        &_value {
            p:first-child { color: inherit }
            p:last-child { color: $black }
        }

        &._blue { color: $blue }
        &._blue &_icon { background: $blue-light }

        &._yellow { color: $yellow }
        &._yellow &_icon { background: $yellow-light }

        &._green { color: $green }
        &._green &_icon { background: $green-light }

    }

</style>



<!--
    Template
-->

<template>
    <div class="item-stats tile" :class="config[type].class">
        <div class="item-stats_icon">
            <ui-icon :value="config[type].icon" type="custom" />
        </div>
        <div class="item-stats_value">
            <p class="h3">{{ value }}</p>
            <p>{{ config[type].text }}</p>
        </div>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#root/global/composables.js'
    import { UiIcon } from '#root/global/components.js'
    import { IconLgBell, IconLgBookmark, IconLgUsers, IconLgJobs } from '#root/global/icons.js'
    const t = useText('item-stats');

    const config = {

        messages: {
            class: '_yellow',
            icon: IconLgBell,
            text: t('MESSAGES')
        },

        bookmarks: {
            class: '_green',
            icon: IconLgBookmark,
            text: t('BOOKMARKS')
        },

        applicants: {
            class: '_blue',
            icon: IconLgUsers,
            text: t('APPLICANTS')
        },

        jobs: {
            class: '_blue',
            icon: IconLgJobs,
            text: t('JOBS')
        }

    }

    defineProps([
        'type',
        'value'
    ])

</script>