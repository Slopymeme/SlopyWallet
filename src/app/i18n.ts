import i18n, {Resource} from "i18next";
import {useTranslation, initReactI18next} from "react-i18next";
import en from "./locales/en.json"
import ru from "./locales/ru.json"


const enResource = en
const ruResource = ru


void i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enResource
		},
		ru: {
			translation: ruResource
		}
	},
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
})

export default i18n;