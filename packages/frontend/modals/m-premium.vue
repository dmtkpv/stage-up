<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <m-alert
        :icon="IconSmPremium"
        :heading="t('HEADING')"
        :button="t('BUTTON')"
        :message="message"
        :onSuccess="onSuccess"
        cancel
    />
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useText, usePlan } from '#root/global/composables.js'
    import { MAlert } from '#root/global/components.js'
    import { IconSmPremium } from '#root/global/icons.js'

    const props = defineProps({
        type: {
            required: true,
            validator: value => ['locations', 'jobs', 'new-company-jobs', 'urgent'].includes(value),
        }
    })

    const t = useText('m-premium');
    const router = useRouter();
    const plan = usePlan();

    const message = computed(() => {
        if (props.type === 'locations') return t('LIMIT_LOCATIONS');
        if (props.type === 'new-company-jobs') return t('LIMIT_JOBS_NEW_COMPANY');
        if (props.type === 'urgent') return t('LIMIT_URGENT');
        if (!plan.id) return t('LIMIT_JOBS_FREE');
        if (plan.id === 1) return t('LIMIT_JOBS_BASIC');
        if (plan.id === 2) return t('LIMIT_JOBS_PRO');
    })

    function onSuccess () {
        const url = router.resolve({ name: 'account-upgrade' });
        window.open(url.href, '_blank').focus();
    }

</script>