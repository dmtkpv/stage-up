import { ROLES } from '@this/shared/constants.js'

export default {



    // -------------------
    // Active plans
    // -------------------

    v_plans: {
        type: '',
        definition: `
            SELECT
                subscriptions.company,
                MAX(plans_prices.plan) AS value
            FROM subscriptions
            INNER JOIN plans_prices ON plans_prices.id = subscriptions.price
            WHERE
                subscriptions.expires_at > NOW() AND
                subscriptions.status IN ('trialing', 'active', 'past_due')
            GROUP BY subscriptions.company
        `
    },



    // -------------------
    // Candidates
    // -------------------

    v_candidates: {
        type: '',
        definition: `
            SELECT 
                users.id,
                users.email,
                users.avatar,
                users.first_name,
                users.last_name,
                users.education_field,
                users.education_level,
                users.gender,
                users.cv,
                users.phone,
                users.last_access,
                users.locale,
                ARRAY_REMOVE(ARRAY_AGG(users_languages.language), NULL) AS languages,
                CONCAT_WS(', ', education_fields.value, education_levels.value) AS tags
            FROM users
            LEFT JOIN education_fields ON education_fields.id = users.education_field
            LEFT JOIN education_levels ON education_levels.id = users.education_level
            LEFT JOIN users_languages ON users_languages.user = users.id
            WHERE
                users.role = '${ROLES.candidate}' AND
                users.status = 'active'
            GROUP BY
                users.id,
                education_fields.id,
                education_levels.id
        `
    },



    // ----------------------
    // Active companies
    // ----------------------

    v_companies: {
        type: '',
        definition: `
            SELECT 
                companies.id,
                companies.slug,
                companies.name,
                companies.email,
                companies.about,
                companies.created_at,
                companies.updated_at,
                companies.image,
                v_plans.value AS plan,
                CASE WHEN v_plans.value IS NULL THEN NULL ELSE phone END AS phone,
                CASE WHEN v_plans.value IS NULL THEN NULL ELSE website END AS website,
                CASE WHEN v_plans.value IS NULL THEN NULL ELSE facebook END AS facebook
            FROM companies
            LEFT JOIN v_plans ON v_plans.company = companies.id
        `
    },



    // -------------------
    // Shared CVs
    // -------------------

    v_cvs: {
        type: '',
        definition: `
            SELECT 
                DISTINCT ON (rooms.company, rooms.candidate)
                rooms.company, 
                rooms.candidate, 
                applications.cv
            FROM applications
            INNER JOIN rooms ON rooms.id = applications.room
            WHERE applications.cv IS NOT NULL
            ORDER BY
                rooms.company, 
                rooms.candidate,
                applications.created_at DESC
        `
    },



    // ----------------------
    // Room company members
    // ----------------------

    v_rooms_members: {
        type: '',
        definition: `
            SELECT 
                rooms.id AS room,
                users.id AS member
            FROM rooms
            INNER JOIN users ON users.company = rooms.company
            WHERE rooms.job IS NULL
            UNION ALL
            SELECT 
                rooms.id AS room,
                users_locations.user AS member
            FROM rooms
            INNER JOIN jobs ON jobs.id = rooms.job
            INNER JOIN users_locations ON users_locations.location = jobs.location
        `
    },



    // -------------------
    // Jobs
    // -------------------

    v_jobs: {
        type: 'materialized',
        definition: `

            SELECT 
                jobs.*,
                v_companies.id AS company,
                v_companies.name AS company_name,
                v_companies.image,
                locations.geometry,
                COALESCE(locations.components_en->>'locality', locations.components_en->>'region', locations.address_en) AS city_en,
                COALESCE(locations.components_nl->>'locality', locations.components_nl->>'region', locations.address_nl) AS city_nl,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT companies_branches.branch), NULL) AS branches,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_categories.category), NULL) AS categories,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_levels.education_level), NULL) AS education_levels,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_fields.education_field), NULL) AS education_fields,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_education_paths.education_path), NULL) AS education_paths,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_keywords.keyword), NULL) AS keywords_jobs,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_languages.language), NULL) AS languages,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT jobs_images.image), NULL) AS images,
                ARRAY_TO_STRING(
                    ARRAY_AGG(DISTINCT branches_translations.en) || 
                    ARRAY_AGG(DISTINCT branches_translations.nl) || 
                    ARRAY_AGG(DISTINCT categories_translations.en) || 
                    ARRAY_AGG(DISTINCT categories_translations.nl) ||
                    ARRAY_AGG(DISTINCT languages_translations.en) ||
                    ARRAY_AGG(DISTINCT languages_translations.nl) ||
                    ARRAY_AGG(DISTINCT education_levels.value) || 
                    ARRAY_AGG(DISTINCT education_fields.value) || 
                    ARRAY_AGG(DISTINCT education_fields.alias) || 
                    ARRAY_AGG(DISTINCT education_paths.value),
                    ', '
                ) AS tags
                
            FROM jobs        
            INNER JOIN locations ON locations.id = jobs.location
            INNER JOIN v_companies ON v_companies.id = locations.company
            
            LEFT JOIN companies_branches ON companies_branches.company = v_companies.id 
            LEFT JOIN jobs_categories ON jobs_categories.job = jobs.id 
            LEFT JOIN jobs_education_levels ON jobs_education_levels.job = jobs.id 
            LEFT JOIN jobs_education_fields ON jobs_education_fields.job = jobs.id 
            LEFT JOIN jobs_education_paths ON jobs_education_paths.job = jobs.id 
            LEFT JOIN jobs_images ON jobs_images.job = jobs.id
            LEFT JOIN jobs_keywords ON jobs_keywords.job = jobs.id
            LEFT JOIN jobs_languages ON jobs_languages.job = jobs.id
            
            LEFT JOIN branches ON branches.id = companies_branches.branch
            LEFT JOIN categories ON categories.id = jobs_categories.category
            LEFT JOIN education_levels ON education_levels.id = jobs_education_levels.education_level
            LEFT JOIN education_fields ON education_fields.id = jobs_education_fields.education_field
            LEFT JOIN education_paths ON education_paths.id = jobs_education_paths.education_path
            LEFT JOIN keywords_jobs ON keywords_jobs.id = jobs_keywords.keyword
            LEFT JOIN languages ON languages.id = jobs_languages.language
            
            LEFT JOIN translations AS branches_translations ON branches_translations.id = branches.value
            LEFT JOIN translations AS categories_translations ON categories_translations.id = categories.value
            LEFT JOIN translations AS languages_translations ON languages_translations.id = languages.value
            
            WHERE jobs.archived = false AND jobs.publish = true
            GROUP BY jobs.id, locations.id, v_companies.id, v_companies.name, v_companies.image
            
        `,

        onCreate: async db => {
            await db.raw(`CREATE UNIQUE INDEX ON v_jobs (id)`)
            await db.raw(`CREATE INDEX v_jobs_created_at_asc ON v_jobs (premium DESC, created_at ASC)`)
            await db.raw(`CREATE INDEX v_jobs_created_at_desc ON v_jobs (premium DESC, created_at DESC)`)
            await db.raw(`CREATE INDEX v_jobs_geometry ON v_jobs USING gist (geometry)`)
        }

    },



}