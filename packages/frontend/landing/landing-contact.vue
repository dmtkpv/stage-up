<!--
    Styles
-->

<style lang="scss">

    .landing-contact {

        section {

            display: grid;

            @include lg-md {
                gap: 32px;
                grid-template-columns: repeat(3, 1fr);
            }

            @include md-sm {
                gap: 24px;
            }

            a {

                display: flex;
                flex-direction: column;
                text-align: center;
                align-items: center;

                & > svg {
                    color: $blue;
                    width: 48px;
                    margin: 0 auto;
                }

                h3 {
                    margin: 16px 0;
                }

                p {
                    flex-grow: 1;
                }

                .ui-link {
                    margin-top: 24px;
                }

                @include lg {
                    padding: 32px 64px;
                }

                @include md-sm {
                    padding: 24px;
                }

            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-contact container-md">

        <landing-heading
            :title="t('HEADING')"
            :note="t('DESCRIPTION')"
        />

        <section>
            <a class="tile" v-for="{ icon, title, note, button, url, click } in tiles" :href="url" @click="click">
                <ui-icon :value="icon" />
                <h3 class="h5">{{ title }}</h3>
                <p>{{ note }}</p>
                <ui-link class="w6" v-if="button" :text="button" />
            </a>
        </section>

    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText, useCrisp } from '#root/global/composables.js'
    import { LandingHeading, UiIcon, UiLink } from '#root/global/components.js'
    import { IconIlContactLocation, IconIlContactHelp, IconIlContactSupport } from '#root/global/icons.js'

    const t = useText('landing-contact');
    const crisp = useCrisp();

    const tiles = [
        {
            icon: IconIlContactLocation,
            title: t('TILE_1_HEADING'),
            note: t('TILE_1_DESCRIPTION'),
        },
        {
            icon: IconIlContactHelp,
            title: t('TILE_2_HEADING'),
            note: t('TILE_2_DESCRIPTION'),
            button: t('TILE_2_BUTTON'),
            url: t('TILE_2_URL'),
        },
        {
            icon: IconIlContactSupport,
            title: t('TILE_3_HEADING'),
            note: t('TILE_3_DESCRIPTION'),
            button: t('TILE_3_BUTTON'),
            click: () => crisp.toggle()
        }
    ]

</script>