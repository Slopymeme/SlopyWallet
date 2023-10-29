import {RewardApi} from "./reward.api";
import {MarketApi} from "./market.api";


export default {
	reward: new RewardApi(),
	market: new MarketApi()
}