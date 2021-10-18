import BaseCrud from '@/helpers/BaseCrud';
const crud = new BaseCrud('user', 'users', true);

export const state = () => ({ ...crud.state });

export const getters = {
    ...crud.getters
};

export const mutations = {
    ...crud.mutations
};

export const actions = {
    ...crud.actions
};
