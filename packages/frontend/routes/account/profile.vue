<!--
    Styles
-->

<style lang="scss">

    .WT8jwq {
        margin-bottom: $padding-y;
    }

</style>



<!--
    Template
-->

<template>
    <section>


        <!-- profile -->

        <article class="WT8jwq">

            <l-heading>
                <h1 class="h3">{{ t('HEADING') }}</h1>
            </l-heading>

            <l-form
                class="tile"
                :value="profile"
                :button="t('BUTTON_PROFILE')"
                :form="formProfile"
                :defaults="data.profile"
                :loading="saveProfile.pending"
                @submit="saveProfile.quiet(profile)"
            />

        </article>


        <!-- password -->

        <article>

            <l-heading>
                <h2 class="h4">{{ t('HEADING_PASSWORD') }}</h2>
            </l-heading>

            <l-form
                class="tile"
                :value="password"
                :form="formPassword"
                :button="t('BUTTON_PASSWORD')"
                :loading="savePassword.pending"
                @submit="savePassword.quiet(password)"
            />

        </article>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { usePreload, useAPI, useUser, useText, useMeta, useLists, toastAPIError } from '#root/global/composables.js'
    import { empty } from '#root/global/utils.js'
    import { LHeading, LForm } from '#root/global/components.js'
    import { useFormProfile, useFormPassword } from '#root/global/forms.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'genders',
            'education_levels',
            'education_fields',
            'languages',
        ],

        texts: [
            'i-image',
            'route-account-profile'
        ],

        preload ({ api, state }) {
            return {
                cvs: state.user.role === 'candidate' && api('account-cvs-list').fetch(),
                profile: api('account-profile-item').fetch()
            }
        }
    })



    // -------------------
    // Data
    // ------------------

    const t = useText('route-account-profile');
    const data = usePreload();
    const user = useUser();
    const lists = useLists();
    const profile = reactive({});
    const password = reactive({});
    const formProfile = useFormProfile({ t, user, data, lists, profile });
    const formPassword = useFormPassword({ t });
    const saveProfile = useAPI('account-profile-update');
    const savePassword = useAPI('account-profile-password');



    // -------------------
    // Hooks
    // -------------------

    saveProfile.onSuccess(() => {
        Object.assign(data.profile, profile);
        Object.keys(user).forEach(key => profile[key] && (user[key] = profile[key]))
        empty(profile);
    })

    savePassword.onSuccess(() => {
        empty(password);
    })

    useMeta();
    toastAPIError(saveProfile, formProfile);
    toastAPIError(savePassword, formPassword);



</script>