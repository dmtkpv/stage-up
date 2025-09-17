import { ROLES } from '@this/shared/constants.js'



// -----------------
// Relations
// -----------------

const relations = {

    v_candidates () {
        return this.innerJoin('v_candidates', 'v_candidates.id', 'rooms.candidate');
    },

    v_companies () {
        return this.innerJoin('v_companies', 'v_companies.id', 'rooms.company');
    },

    jobs () {
        return this.leftJoin('jobs', 'jobs.id', 'rooms.job');
    },

    applications () {
        return this.leftJoin('applications', 'applications.room', 'rooms.id');
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    item () {
        this.relation('rooms', 'v_candidates');
        this.relation('rooms', 'v_companies');
        this.relation('rooms', 'jobs');
        return [
            'rooms.id',
            this.toJSON('candidate', [
                'v_candidates.id',
                'v_candidates.first_name',
                'v_candidates.last_name',
                'v_candidates.avatar',
                'v_candidates.email',
                'v_candidates.education_field',
                'v_candidates.education_level',
            ]),
            this.toJSON('company', [
                'v_companies.id',
                'v_companies.slug',
                'v_companies.name',
                'v_companies.image',
                'v_companies.email'
            ]),
            this.toJSON('job', [
                'jobs.id',
                'jobs.title',
            ]),
        ]
    },

    details () {
        const { locale } = this.userParams;
        this.relation('rooms', 'v_candidates');
        this.relation('v_candidates', 'v_cvs');
        this.relation('rooms', 'v_companies');
        this.relation('rooms', 'jobs');
        this.relation('rooms', 'applications');
        this.relation('jobs', 'locations', 'left');
        return [
            'rooms.id',
            this.toJSON('candidate', [
                'v_candidates.id',
                'v_candidates.first_name',
                'v_candidates.last_name',
                'v_candidates.avatar',
                'v_candidates.email',
                'v_candidates.education_field',
                'v_candidates.education_level',
                'v_candidates.languages',
                'COALESCE(v_cvs.cv, v_candidates.cv) AS cv'
            ]),
            this.toJSON('company', [
                'v_companies.id',
                'v_companies.slug',
                'v_companies.name',
                'v_companies.image',
                'v_companies.email'
            ]),
            this.toJSON('job', [
                'jobs.id',
                'jobs.slug',
                'jobs.archived',
                'jobs.title',
                `locations.city_${locale} AS city`,
                'v_companies.image AS image',
                'v_companies.name AS company_name',
                'applications.status'
            ]),



        ]
    }


}



// -----------------
// Filter
// -----------------

function filter ({ my = true, archived, read } = {}) {

    const { role, user, company, type } = this.client.userParams;

    if (my) {
        if (role === ROLES.candidate) this.where('rooms.candidate', user);
        else this.where('rooms.company', company);
        if (role === ROLES.member) {
            this.relation('rooms', 'jobs');
            this.relation('jobs', 'users_locations', 'left')
            this.where(wb => wb.whereNull('rooms.job').orWhere('users_locations.user', user));
        }
    }

    if (read !== undefined) {
        const sign = read ? '<=' : '>';
        this.whereRaw(`rooms.messaged_at ${sign} rooms.${type}_visited_at`);
    }

    if (archived !== undefined) {
        this.where(`rooms.${type}_archived`, archived);
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    relations,
    fields,
    queries: { filter }
}