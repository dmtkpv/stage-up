import { ROLES } from '@this/shared/constants.js'



// -----------------
// Data
// -----------------

const data = {

    locations: {
        table: 'users_locations',
        fk: 'location',
        pk: 'user'
    },

    languages: {
        table: 'users_languages',
        fk: 'language',
        pk: 'user'
    }

}



// -----------------
// Relations
// -----------------

const relations = {

    users_locations () {
        return this.leftJoin('users_locations', 'users_locations.user', 'users.id')
    }

}



// -----------------
// Fields
// -----------------

const fields = {

    member () {
        return [
            'users.id',
            'users.email',
            'users.avatar',
            'users.first_name',
            'users.last_name',
        ]
    },

    auth () {
        return [
            'users.id',
            'users.role',
            'users.company'
        ]
    }

}



// -----------------
// Filter
// -----------------

function filter ({ members } = {}) {

    if (members) {
        const { company } = this.userParams;
        this.where('users.company', company)
        this.where('users.role', ROLES.member)
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    data,
    relations,
    fields,
    queries: { filter }
}