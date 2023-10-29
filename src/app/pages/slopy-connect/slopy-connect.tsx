import styles from "./slopy-connect.module.scss"
import Header from "../../components/header";
import cn from "classnames";
import {useTranslation} from "react-i18next";
import {useModalState} from "../../../modules/core/hooks/use-modal-state";
import Modal from "../../components/modal";
import React, {useEffect, useRef, useState} from "react";
import {useWeb3Services} from "../../contexts/web3-context";
import useSWR from "swr";
import {useAppSelector} from "../../../shared/store";
import {FMT_NUMBER} from "web3";
import {useAppForm} from "../../../modules/core/hooks/use-app-form";
import Yup from "../../../modules/core/yup";
import Checkbox from "../../components/checkbox";
import {FormProvider, useWatch} from "react-hook-form";
import {SlopyConfig} from "../../../config";
import {fromWei} from "../../../modules/hex.utiils";
import useSWRImmutable from "swr/immutable";
import {ERC20ABI} from "../../../modules/crypto/contracts/erc20-abi";
import {formatUnits} from "ethers";
import {BigNumber} from "@ethersproject/bignumber";
import api from "../../api";
import {Chain} from "@ethereumjs/common";
import Decimal from 'decimal.js';
import Confetti from 'react-confetti'
import {useWindowSize} from "@uidotdev/usehooks";
import {useLocation} from "react-router-dom";

function getSlopyTokenBalances(prices: any, slopyBalance: any) {
	if (!prices || !slopyBalance) {
		return {
			tokenBalance: "0",
			usdBalance: "0.00"
		}
	}

	const slopyUsdPrice = new Decimal(prices[0].usdPrice as string)
	let formattedSlopyBalance = new Decimal(formatUnits(slopyBalance.toString(), SlopyConfig.Token.decimals))

	const usdBalance = slopyUsdPrice.mul(formattedSlopyBalance).toFixed(2)

	return {
		usdBalance,
		tokenBalance: formattedSlopyBalance.toFixed(3)
	}

}


const defaultValue = false

export function SlopyConnect() {

	// const {width, height} = useWindowSize()


	const {t, i18n} = useTranslation()
	const [isShow, setIsShow] = useState(false)
	const {wallet} = useAppSelector((state) => state.popup)
	const {data: nftCount} = useSWR(wallet?.address && `nft-count-${wallet?.address}`,
		async () => api.market.getNftCount(SlopyConfig.NFT.contract, wallet?.address as string))


	const [canCheckReward, setCanCheckReward] = useState(defaultValue)
	const {data: reward} = useSWR(wallet?.address && canCheckReward && `reward-${wallet.address}`,
		() => api.reward.retrieve(wallet?.address as string, wallet?.publicKey as string))


	const {mainnet: web3} = useWeb3Services()


	const {data: slopyBalance, error} = useSWR(`slopy-balance`, async () => {
		const address = wallet?.address as string
		const contract = new web3.eth.Contract<typeof ERC20ABI>(ERC20ABI, SlopyConfig.Token.contract)
		const balance = (await contract.methods.balanceOf(address).call()).toString()
		return BigNumber.from(balance)
	})


	const {data: prices} = useSWR("token-prices",
		async () => api.market.getTokenPrices([SlopyConfig.Token.contract], Chain.Mainnet))


	useEffect(() => {
		const contract = new web3.eth.Contract<typeof ERC20ABI>(ERC20ABI, SlopyConfig.Token.contract)

		void async function () {
			const isMaster = (await contract.methods.isWhiteList(wallet?.address as string).call()) as boolean
			if (isMaster) {
				setValue("master", true)
				setValue("tidy", false)
			}
		}()

	}, []);


	useEffect(() => {
		if (slopyBalance && slopyBalance.gte(0) && nftCount) {
			setCanCheckReward(true)
		}

	}, [slopyBalance, nftCount]);


	useEffect(() => {
		if (typeof slopyBalance === "undefined") {
			return
		}


		const formattedSlopyBalance = new Decimal(formatUnits(slopyBalance.toString(), SlopyConfig.Token.decimals))

		if (formattedSlopyBalance.gte(SlopyConfig.walletStatuses.Master)) {
			setValue("master", true)
		} else {
			if (formattedSlopyBalance.gte(SlopyConfig.walletStatuses.TIDY)) {
				setValue("tidy", true)
			}
		}
	}, [slopyBalance]);


	const {isOpen, open, close} = useModalState(false)
	const {ref: formRef, methods} = useAppForm({
		schema: Yup.object().shape({
			master: Yup.boolean().required(),
			tidy: Yup.boolean().required(),
			policy: Yup.boolean().required(),

		}),
		onSubmit: async () => {},
		formProps: {
			defaultValues: {
				tidy: false,
				master: false,
				policy: false
			}
		}
	})
	const rewardRef = useRef<HTMLDivElement | null>(null)

	const {setValue} = methods


	const policy = useWatch({control: methods.control, name: "policy"})



	return (
		<FormProvider {...methods}>
			<Modal open={isOpen} onClose={async () => {
				const policy = methods.getValues("policy")
				if (policy) {
					!reward?.read && void api.reward.setReadFlag(wallet?.address as string,
						wallet?.privateKey as string)
				}
				setIsShow(false)
				setValue("policy", false)
				close()
			}} className={styles.modal}>
				<div className={styles.reward} ref={rewardRef}>
					{isShow ? (
						<>
							{reward && !reward.read && <Confetti
								width={(rewardRef.current?.offsetWidth as number) + 45}
								height={rewardRef.current?.offsetHeight as number - 50}
							/>}
							<div className={styles.circle}>
								<img src="static/icons/gift.png"/>
							</div>
							{(!reward || reward?.read) && (
								<div className={styles.empty}>Empty</div>
							)}
							{reward && !reward.read && (
								<div className={styles.rewardContent}>
									{reward.text}
								</div>
							)}
						</>
					) : (
						<>
							<div className={styles.circle}>
								<img src="static/icons/gift.png"/>
							</div>
							<div className={styles.reward__importantText}>{t("slopyConnect.oneTimeMessage")}</div>
							<div className={styles.reward__text}>{t("slopyConnect.needSaveText")}</div>

							<button
								type="button"
								className={cn("button", styles.openBtn)}

								onClick={async () => {
									console.log(policy)
									if (policy) {
										setIsShow(true)
									}
								}}

							>Открыть
							</button>
							<Checkbox name="policy" textClassName={styles.checkboxText}
							          text={t("slopyConnect.policy")}/>

							{/*<hr className="separator" style={{marginTop: "20px"}} />*/}


							{/*<div className={styles.slopyLinks}>*/}

							{/*</div>*/}

						</>
					)}
				</div>
			</Modal>
			<form className={styles.page} ref={formRef}>
				<Header/>
				<div className={styles.page__title}>
					SLOPY CONNECT
				</div>

				<hr className="separator" style={{marginTop: "20px"}}/>


				<div className={styles.balanceSection}>
					<div className={styles.violetCircle}>
						<img src="static/icons/s.png"/>
					</div>
					<div className={styles.balanceSection__wrapper}>
						<div className={styles.balanceSection__title}>{t("slopyConnect.slopyBalance")}</div>
						<div className={styles.balanceSection__balance}>
							<div>{getSlopyTokenBalances(prices, slopyBalance).usdBalance}$</div>
							<div className={styles.balanceSection__grayBalance}>{getSlopyTokenBalances(prices,
								slopyBalance).tokenBalance}</div>
						</div>
						<div className={styles.balanceSection__checkboxes}>
							<Checkbox name="tidy" textClassName={styles.checkboxText}
							          text={t("slopyConnect.tidyWallet")}
							          disabled
							/>
							<Checkbox name="master" textClassName={styles.checkboxText}
							          text={t("slopyConnect.masterWallet")}
							          disabled
							/>
						</div>
					</div>
				</div>

				<div className="separator" style={{marginTop: "10px"}}/>

				<div className={styles.balanceSection}>
					<div className={styles.violetCircle}>
						<img src="static/icons/nft.png"/>
					</div>
					<div className={styles.balanceSection__wrapper}>
						<div className={styles.balanceSection__title}>{t("slopyConnect.nftSlopyBalance")}</div>
						<div className={styles.balanceSection__balance}>{nftCount ? nftCount : 0}</div>
					</div>
				</div>


				<hr className="separator" style={{marginTop: "20px"}}/>


				<div className={styles.links}>

					<a className={styles.links__item} href={SlopyConfig.meta.website} target="_blank">
						<div className={styles.grayCircle}>
							<img src="static/icons/web.png"/>
						</div>
						<div className={styles.links__text}>{t("slopyConnect.slopyWebsite")}</div>
					</a>

					<a className={styles.links__item} href={SlopyConfig.meta.nftCollection} target="_blank">
						<div className={styles.grayCircle}>
							<img src="static/icons/sm-nft.png"/>
						</div>
						<div className={styles.links__text}>{t("slopyConnect.nftCollection")}</div>
					</a>


				</div>

				<hr className="separator" style={{marginTop: "20px"}}/>
				<div className={styles.checkRewardText}>
					{canCheckReward && t("slopyConnect.canReward")}
					{!canCheckReward && t("slopyConnect.cantReward")}
				</div>

				<button
					className={cn("button", "page__confirm", styles.rewardButton)}
					onClick={open}
					disabled={!canCheckReward}
				>CHECK REWARD
				</button>
			</form>
		</FormProvider>
	)
}