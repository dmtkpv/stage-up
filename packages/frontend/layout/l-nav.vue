<!--
    Styles
-->

<style lang="scss">

</style>


<!--
    Template
-->

<template>
    <nav class="l-nav">

        <ui-button
            v-if="user.role !== 'candidate'"
            :to="{ name: 'account-job-upsert', params: { id: '+' } }"
            :text="t('JOB_BUTTON')"  />

        <template v-for="item in nav">
            <ui-item
                v-if="visible(item)"
                :key="item.to"
                :icon="item.icon"
                :text="t(item.text)"
                :to="{ name: item.to }"
            />
        </template>

        <hr>

        <ui-item
            :text="t('LOGOUT')"
            :icon="IconLgLogout"
            :disabled="logout.pending"
            @click="logout.quiet()"
        />

    </nav>
</template>


<!--
    Scripts
-->

<script setup>

    import nav from '#root/config/nav.js'
    import { useRouter, useRoute } from 'vue-router'
    import { useUser, useText, useAPI } from '#root/global/composables.js'
    import { UiButton, UiItem } from '#root/global/components.js'
    import { IconLgLogout } from '#root/global/icons.js'

    const t = useText('l-nav')
    const user = useUser();
    const route = useRoute();
    const router = useRouter();
    const logout = useAPI('auth-logout');

    function visible ({ roles, plan }) {
        if (plan && !user.plan) return false;
        return roles.includes(user.role);
    }

    logout.onComplete(() => {
        if (route.meta.roles) router.push({ name: 'home' })
        else router.push({ query: { ...route.query, t: Date.now() } })
    })

</script>