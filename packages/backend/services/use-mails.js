import path from 'path'
import fs from 'fs'
import Mustache from 'mustache'
import { createTransport } from 'nodemailer'
import { joi, Exception } from '#root/index.js'

const { FRONTEND_URL, BACKEND_URL, MAIL_FROM, MAIL_REPLY_TO, MAIL_HOST, MAIL_PORT } = process.env;
const filepath = path.resolve('./templates/email.mustache');
const file = fs.readFileSync(filepath, 'utf8');

const smtp = createTransport( {
    host: MAIL_HOST,
    port: MAIL_PORT
});

export default function ({ db, routes, ...ctx }) {



    // -----------------
    // Send
    // -----------------

    async function send (key, options) {

        const { to, cc, data, reply_to, locale } = joi.check(options, {
            to: joi.string().email().required(),
            cc: joi.array(),
            data: joi.object().required(),
            reply_to: joi.string().email(),
            locale: joi.string().valid('en', 'nl').default(ctx.locale)
        })

        const template = await db('templates').where({ key }).first().select([
            'subject',
            'body',
            'button',
            'route',
            'route_options'
        ])

        const settings = await db('settings').first().select([
            'email_default_name',
            'email_greeting',
            'email_signature',
            'email_footer',
            'email_logo',
            'project_name'
        ]);

        Object.assign(data, {
            project_name: settings.project_name,
            email_logo: settings.email_logo
        })

        const translations = await db('translations').select('id', locale).whereIn('id', [
            template.subject,
            template.body,
            template.button,
            settings.email_greeting,
            settings.email_signature,
            settings.email_footer,
            settings.email_default_name,
        ])

        if (!data.name) {
            data.name = translate(settings.email_default_name)
        }

        const params = {
            FRONTEND_URL,
            BACKEND_URL,
            subject: render(template.subject),
            body: render(template.body),
            email_greeting: render(settings.email_greeting),
            email_signature: render(settings.email_signature),
            email_footer: render(settings.email_footer),
            email_logo: settings.email_logo,
            project_name: settings.project_name,
            message: data.message,
            headline: data.headline,
        }

        if (template.button) {
            const route_options = Mustache.render(template.route_options, data);
            params.button_url = routes.resolve(template.route, { locale, ...JSON.parse(route_options) });
            params.button = render(template.button);
        }

        function translate (id) {
            return translations.find(translation => translation.id === id)[locale];
        }

        function render (id) {
            return Mustache.render(translate(id), data);
        }

        const from = `${params.project_name} <${MAIL_FROM}>`;
        const html = Mustache.render(file, params);

        const mail = {
            from, to, html,
            cc: cc?.filter(email => email !== to),
            subject: params.subject,
            replyTo: reply_to ?? MAIL_REPLY_TO
        }

        try {
            await smtp.sendMail(mail);
        }
        catch (e) {
            throw new Exception('FAILED_EMAIL')
        }



    }



    // -----------------
    // Exports
    // -----------------

    return {
        send
    }

}



