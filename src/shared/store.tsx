import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {Provider, TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {persistCombineReducers, persistReducer, persistStore} from 'redux-persist';
import {popupReducer} from "../modules/popup/popup.slice";
import {FC, PropsWithChildren} from "react";
import {PersistGate} from 'redux-persist/integration/react';

const persistConfig: any = {
	key: 'root', // localStorage key
	version: 1,
	storage: createWebStorage("local"),
	whitelist: ["popup"]
}

export const rootReducer = combineReducers({
	popup: popupReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer) as unknown as typeof rootReducer;
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false
	}) as any
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


export type HOCSignatureType = {
	<P extends object>(Component: FC<P>): (props: PropsWithChildren<P>) => JSX.Element
}


export const withRedux: HOCSignatureType = (Component) => (props) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Component {...props}>
					{props.children}
				</Component>
			</PersistGate>
		</Provider>
	)
}
