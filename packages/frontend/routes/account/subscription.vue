<!--
    Styles
-->

<style lang="scss">



    // -------------------
    // Current plan
    // -------------------

    .sIwE8E {

        text-align: left;

        .ui-button {
            display: none;
        }

        ul:last-child {
            display: flex;
            flex-wrap: wrap;
            gap: 16px 48px;
            margin-top: 32px;
        }

    }



    // -------------------
    // Free
    // -------------------

    .QzP3Zz {

        margin-bottom: $padding-y;

        &_note {
            margin: 16px 0;
        }

    }



</style>



<!--
    Template
-->

<template>
    <section>


        <!-- heading -->

        <l-heading>
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <template v-if="data.subscription && !data.subscription.manual" #controls>
                <ui-button
                    :text="data.subscription.status === 'canceled' ? t('BUTTON_BILLING') : t('BUTTON_EDIT')"
                    :loading="manage.pending"
                    @click="manage.quiet('update')"
                />
            </template>
        </l-heading>


        <!-- current plan -->

        <item-plan
            class="sIwE8E"
            v-if="active"
            :value="plan"
            :annual="data.subscription.annual">
            <ul class="ul-reset">
                <li>
                    <p class="h5">{{ t('LABEL_STATUS') }}</p>
                    <p>{{ t(`STATUS_${data.subscription.status.toUpperCase()}`) }}</p>
                </li>
                <li v-if="!data.subscription.manual">
                    <p class="h5">{{ data.subscription.canceled ? t('LABEL_EXPIRES_AT') : t('LABEL_RENEWS_ON') }}</p>
                    <ui-date :value="data.subscription.expires_at" />
                </li>
            </ul>
        </item-plan>


        <!-- free -->

        <article v-if="!active" class="QzP3Zz tile _padded">

            <div class="row">
                <h2 class="h4">{{ t('FREE_TITLE') }}</h2>
                <ui-tag type="blue" :text="t('FREE_LABEL')" />
            </div>

            <p class="QzP3Zz_note">{{ t('FREE_NOTE') }}</p>

            <ul class="list">
                <li v-for="feature in free">
                    <div class="list_icon"><ui-icon :value="IconSmCheck" /></div>
                    <p v-html="feature.text" />
                </li>
            </ul>

        </article>


        <!-- upgrade -->

        <article v-if="!active">

            <l-heading>
                <h2 class="h4">Upgrade</h2>
            </l-heading>

            <promo-upgrade />

        </article>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useAPI, usePreload, useText, useMeta, toastAPIError, useFeatures } from '#root/global/composables.js'
    import { LHeading, ItemPlan, UiButton, UiDate, UiTag, UiIcon, PromoUpgrade } from '#root/global/components.js'
    import { IconSmCheck } from '#root/global/icons.js'

    defineOptions({

        texts: [
            'item-plan',
            'promo-upgrade',
            'route-account-subscription'
        ],

        features: [
            'free',
            'upgrade'
        ],

        async preload ({ api }) {
            return {
                plans: api('content-plans').fetch(),
                subscription: api('account-subscription').fetch()
            }
        }

    })

    const t = useText('route-account-subscription');
    const data = usePreload();
    const manage = useAPI('stripe-manage');
    const free = useFeatures('free');

    const active = computed(() => {
        return data.subscription && data.subscription.status !== 'canceled'
    })

    const plan = computed(() => {
        return data.plans.find(plan => plan.id === data.subscription?.plan);
    });

    manage.onSuccess(data => {
        window.location.replace(data.url);
    })

    useMeta();
    toastAPIError(manage);



</script>