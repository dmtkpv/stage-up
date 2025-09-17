import { FOLDERS } from '@this/shared/constants.js'



// -----------------
// Relations
// -----------------

const relations = {

    applications () {
        return this.leftJoin('applications', 'applications.cv', 'files.id')
    },

    jobs_images (method = 'inner') {
        return this[method + 'Join']('jobs_images', 'jobs_images.image', 'files.id')
    }

}



// -----------------
// Filter
// -----------------

function filter ({ my = true, archived = false, folder, job } = {}) {

    if (my) {
        const { user } = this.userParams;
        this.where('files.uploaded_by', user)
    }

    if (archived !== undefined) {
        this.where('files.archived', archived)
    }

    if (folder) {
        this.where('files.folder', FOLDERS[folder])
    }

    if (job !== undefined) {
        if (job) {
            this.relation('files', 'jobs_images');
            this.where('jobs_images.job', job)
        }
        else {
            this.relation('files', 'jobs_images', 'left');
            this.where('jobs_images.job', null)
            this.where('files.folder', FOLDERS.jobs);
        }
    }

    return this;

}



// -----------------
// Exports
// -----------------

export default {
    relations,
    queries: { filter }
}