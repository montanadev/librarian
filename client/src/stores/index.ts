import {applyMiddleware, createStore, Middleware, Store} from "redux";
import thunk from "redux-thunk";
import {JobModel} from "../models/Job";
import {LibraryModel} from "../models/Library";

export const
    LOAD_LIBRARY = 'LOAD_LIBRARY',
    ADD_JOB = 'ADD_JOB',
    REFRESH_JOB = 'REFRESH_JOB',
    LOAD_DOCUMENT = 'LOAD_DOCUMENT',
    SET_BREADCRUMB = 'SET_BREADCRUMB';

export interface RootState {
    jobs: JobModel[];
    library: LibraryModel;
    document: any;
    breadcrumbs: any[];
}

export interface Action {
    type: string;
    payload: any;
}

function reducer(state: RootState, action: Action) {
    switch (action.type) {
        case LOAD_LIBRARY:
            return {
                ...state, library: action.payload
            };
        case ADD_JOB:
            return {
                ...state, jobs: [...state.jobs, action.payload],
            }
        case REFRESH_JOB:
            let newJobs = state.jobs.map((item) => {
                if (item.id !== action.payload.id) {
                    return item
                }
                return action.payload
            });
            return {
                ...state, jobs: newJobs,
            }
        case LOAD_DOCUMENT:
            return {
                ...state, document: action.payload
            }
        case SET_BREADCRUMB:
            return {
                ...state, breadcrumbs: action.payload
            }
        default:
            return state;
    }
}


export const logger: Middleware = (store) => (next) => (action) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(action);
    }
    return next(action);
};

export function configureStore(initialState?: RootState): Store<RootState> {
    let middleware = applyMiddleware(thunk, logger);

    return createStore(reducer as any, initialState, middleware) as Store<RootState>;
}