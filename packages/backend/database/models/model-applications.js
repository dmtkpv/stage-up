// -----------------
// Relations
// -----------------

const relations = {

    rooms () {
        return this.innerJoin('rooms', 'applications.room', 'rooms.id');
    }

}



// -----------------
// Filter
// -----------------

function filter ({ my = true, archived, status, job, search } = {}) {

    if (my) {
        this.relation('applications', 'rooms');
        this.query('rooms', 'filter');
    }

    if (archived !== undefined) {
        const { type } = this.userParams;
        this.where(`applications.${type}_archived`, archived);
    }

    if (status) {
        this.where('applications.status', status);
    }

    if (job) {
        this.relation('applications', 'rooms');
        this.where('rooms.job', job);
    }

    if (search) {
        this.relation('applications', 'rooms');
        this.relation('rooms', 'jobs');
        this.where('jobs.title', 'ILIKE', `%${search}%`);
    }

    return this

}



// -----------------
// Exports
// -----------------

export default {
    relations,
    queries: { filter }
}