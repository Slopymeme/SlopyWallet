import {HOCSignatureType, useAppDispatch, useAppSelector} from "../../shared/store";
import {useEffect} from "react";
import {Outlet, useHref, useLocation, useNavigate} from "react-router-dom";
import {popupActions} from "../../modules/popup/popup.slice";
import qs from "qs";
import {useLocalStorage} from "@uidotdev/usehooks";
import {PageRoutes} from "../../config";
import {isPast} from "date-fns";
import addMinutes from "date-fns/addMinutes";


export function useLastOpenPage() {
	return useLocalStorage<string>("latestOpenPage", undefined);
}


export function LastOpenPageUpdater() {
	const location = useLocation()
	const dispatch = useAppDispatch()
	// const [_, setPath] = useLastOpenPage()
	const navigate = useNavigate()
	const {wallet, unBlockedAt, lastOpenPage} = useAppSelector((state) => state.popup)

	useEffect(() => {

		if (!wallet) {
			navigate(PageRoutes.Welcome)
		} else if (!unBlockedAt || isPast(addMinutes(new Date(unBlockedAt), 5))) {
			navigate(PageRoutes.Unblock)
		} else {
			navigate(PageRoutes.Home)
		}

		// navigate(PageRoutes.SlopyConnect)
	}, []);


	useEffect(() => {
		const currentPath = `${location.pathname}${location.search}`
		console.log(`Current path: ${currentPath}`)
		// setPath(currentPath)
		// dispatch(popupActions.setLastOpenPage(currentPath))
	}, [location]);


	return <Outlet/>
}