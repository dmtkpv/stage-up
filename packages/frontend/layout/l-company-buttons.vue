<!--
    Styles
-->

<style lang="scss">

    .l-company-buttons {

        .ui-button {

            @include sm {
                padding: 0;
                width: 3em;
                span { display: none }
                &_icon { margin: 0 }
            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="l-company-buttons row t6">
        <ui-button
            v-if="page"
            type="default"
            :icon="IconLgCompany"
            :text="t('BUTTON_PAGE')"
            :to="{ name: 'company', params: { id: company.id, slug: company.slug } }"
        />
        <ui-button
            v-if="company.website"
            type="default"
            target="_blank"
            :icon="IconLgGlobe"
            :href="company.website"
        />
        <ui-button
            v-if="company.facebook"
            type="default"
            target="_blank"
            :icon="IconLgFacebook"
            :href="company.facebook"
        />
        <ui-phone
            v-if="company.phone"
            :value="company.phone"
        />
        <ui-auth :roles="['candidate']">
            <ui-message
                :company="company.id"
                :icon="IconLgMessage"
                type="default"
            />
        </ui-auth>
    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText, useUser } from '#root/global/composables.js'
    import { UiButton, UiPhone, UiAuth, UiMessage } from '#root/global/components.js'
    import { IconLgCompany, IconLgGlobe, IconLgFacebook, IconLgMessage } from '#root/global/icons.js'

    const props = defineProps({
        page: Boolean,
        company: {
            type: Object,
            required: true
        }
    })

    const t = useText('l-company-buttons');
    const user = useUser();


</script>