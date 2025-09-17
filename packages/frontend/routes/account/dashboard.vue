<!--
    Styles
-->

<style lang="scss">



    // -----------------
    // Root
    // -----------------

    .AiFvcO {
        display: grid;
        gap: $padding-y;
    }



    // -----------------
    // Stats
    // -----------------

    .eYDIZC {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
        grid-gap: 16px;
    }



    // -----------------
    // Notifications
    // -----------------

    .YLQWkA {

        padding: $gap;

        .unit-notification {
            padding-left: 0;
            padding-right: 0;
            &:first-child { padding-top: 0 }
            &:last-child { padding-bottom: 0 }
        }

    }



    // -----------------
    // Views
    // -----------------

    .uSMs1J {
        padding: $gap;
    }



</style>



<!--
    Template
-->

<template>
    <section class="AiFvcO">


        <!-- stats -->

        <article>

            <l-heading>
                <h1 class="h3">
                    <span>{{ t('GREETING') }}</span>
                    <span v-if="user.first_name">&nbsp;{{ user.first_name }}</span>
                    <span>!</span>
                </h1>
            </l-heading>

            <div class="eYDIZC">
                <item-stats :type="user.role === 'candidate' ? 'jobs' : 'applicants'" :value="data.applications" />
                <item-stats type="bookmarks" :value="data.favorites" />
            </div>

        </article>


        <!-- notification -->

        <article v-if="data.notifications?.length">

            <l-heading>
                <h2 class="h4">{{ t('NOTIFICATIONS') }}</h2>
                <template #controls>
                    <ui-link v-if="data.notifications.length > 4" :to="{ name: 'account-notifications' }" :text="t('VIEW_MORE')" />
                </template>
            </l-heading>

            <div class="tile YLQWkA">
                <unit-notification v-for="notification in data.notifications" heading="h3" :key="notification.id" :value="notification" />
            </div>

        </article>


        <!-- get started -->

        <article v-if="user.type === 'company' && !data.jobs">

            <l-heading>
                <h2 class="h4">{{ t('START_HEADING') }}</h2>
            </l-heading>

            <promo-post />

        </article>


        <!-- upgrade -->

        <article v-else-if="user.type === 'company' && !user.plan">

            <l-heading>
                <h2 class="h4">{{ t('UPGRADE_HEADING') }}</h2>
            </l-heading>

            <promo-upgrade />

        </article>


        <!-- views -->

        <article v-else>

            <l-heading>
                <h1 class="h4">{{ t('VIEWS') }}</h1>
            </l-heading>

            <ui-views class="tile uSMs1J" :days="days" :views="data.views" />

        </article>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useUser, usePreload, useText, useMeta } from '#root/global/composables.js'
    import { LHeading, ItemStats, UiLink, UiViews, UnitNotification, PromoPost, PromoUpgrade } from '#root/global/components.js'

    const days = 14;



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'promo-post',
            'promo-upgrade',
            'item-stats',
            'route-account-dashboard',
        ],

        features: [
            'post',
            'upgrade',
        ],

        preload ({ api, state }) {

            const isCandidate = state.user.type === 'candidate';
            const hasViews = isCandidate || state.user.plan;

            return {
                jobs: !isCandidate && api('account-jobs-count').fetch(),
                views: hasViews && api('account-views').fetch({ days }),
                applications: api('account-applications-count').fetch(),
                notifications: api('account-messages-list').fetch({ notification: true, limit: 5 }),
                favorites: isCandidate ? api('account-favorite-jobs-count').fetch() : api('account-favorite-users-count').fetch()
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-dashboard');
    const user = useUser();
    const data = usePreload();

    useMeta();



</script>