import axios from 'axios';

export default class {
    #state;
    #getters;
    #mutations;
    #actions;

    constructor(singular, plural, adminOnly = false) {
        if (!plural) {
            plural = `${singular}s`;
        }

        const prefix = adminOnly ? '/admin' : '';

        this.#state = {
            singular,
            plural
        };

        this.#getters = {};

        this.#mutations = {};

        this.#actions = {
            index(
                { state },
                {
                    page = 1,
                    perPage = 10,
                    search = '',
                    sortBy = 'createdAt',
                    descending = true,
                    filters = null
                }
            ) {
                const params = {
                    page,
                    perPage,
                    q: search,
                    sortBy,
                    order: descending ? 'DESC' : 'ASC'
                };

                if (filters) {
                    params.filters = JSON.stringify(filters);
                }

                return axios.$get(`${prefix}/${state.plural}`, {
                    params
                });
            },

            store({ state }, data) {
                return axios.$post(`${prefix}/${state.plural}`, data);
            },

            show({ state }, id) {
                return axios.$get(`${prefix}/${state.plural}/${id}`);
            },

            update({ state }, { id, data }) {
                return axios.$put(`${prefix}/${state.plural}/${id}`, data);
            },

            destroy({ state }, id) {
                return axios.$delete(`${prefix}/${state.plural}/${id}`);
            }
        };
    }

    get state() {
        return this.#state;
    }

    get getters() {
        return this.#getters;
    }

    get mutations() {
        return this.#mutations;
    }

    get actions() {
        return this.#actions;
    }
}
