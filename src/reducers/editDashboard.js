/** @module reducers/editDashboard */
import update from 'immutability-helper';
import { orArray } from '../util';

export const actionTypes = {
    RECEIVED_EDIT_DASHBOARD: 'RECEIVED_EDIT_DASHBOARD',
    RECEIVED_TITLE: 'RECEIVED_TITLE',
    RECEIVED_DESCRIPTION: 'RECEIVED_DESCRIPTION',
    ADD_DASHBOARD_ITEM: 'ADD_DASHBOARD_ITEM',
    REMOVE_DASHBOARD_ITEM: 'REMOVE_DASHBOARD_ITEM',
    UPDATE_DASHBOARD_ITEM: 'UPDATE_DASHBOARD_ITEM',
    RECEIVED_DASHBOARD_LAYOUT: 'RECEIVED_DASHBOARD_LAYOUT',
};

export default (state = {}, action) => {
    switch (action.type) {
        case actionTypes.RECEIVED_EDIT_DASHBOARD:
            return action.value;
        case actionTypes.RECEIVED_TITLE: {
            return Object.assign({}, state, { name: action.value });
        }
        case actionTypes.RECEIVED_DESCRIPTION: {
            return Object.assign({}, state, {
                description: action.value,
            });
        }
        case actionTypes.ADD_DASHBOARD_ITEM:
            return update(state, {
                dashboardItems: { $push: [action.value] },
            });
        case actionTypes.REMOVE_DASHBOARD_ITEM: {
            const idToRemove = action.value;

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === idToRemove
            );

            if (dashboardItemIndex > -1) {
                return update(state, {
                    dashboardItems: {
                        $splice: [[dashboardItemIndex, 1]],
                    },
                });
            }

            return state;
        }
        case actionTypes.RECEIVED_DASHBOARD_LAYOUT: {
            const stateItems = orArray(state.dashboardItems);

            const newStateItems = action.value.map(({ x, y, w, h, i }) => {
                const stateItem = stateItems.find(si => si.id === i);

                return Object.assign({}, stateItem, { w, h, x, y });
            });

            return update(state, {
                dashboardItems: { $set: newStateItems },
            });
        }
        case actionTypes.UPDATE_DASHBOARD_ITEM: {
            const dashboardItem = action.value;

            const dashboardItemIndex = state.dashboardItems.findIndex(
                item => item.id === dashboardItem.id
            );

            if (dashboardItemIndex > -1) {
                const newState = update(state, {
                    dashboardItems: {
                        $splice: [[dashboardItemIndex, 1, dashboardItem]],
                    },
                });

                return newState;
            }

            return state;
        }
        default:
            return state;
    }
};

// selectors
export const sGetEditDashboard = state => {
    return state.editDashboard;
};