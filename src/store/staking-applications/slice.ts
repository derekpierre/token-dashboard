import { AnyAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { featureFlags } from "../../constants"
import {
  StakingProviderAppInfo,
  AuthorizationParameters,
} from "../../threshold-ts/applications"
import { FetchingState } from "../../types"
import { startAppListening } from "../listener"
import { providerStaked, setStakes } from "../staking"
import {
  getSupportedAppsStakingProvidersData,
  getSupportedAppsEffect,
  shouldDisplayNewAppsToAuthorizeModal,
  displayNewAppsToAuthorizeModalEffect,
} from "./effects"

type StakingApplicationDataByStakingProvider = {
  [stakingProvider: string]: StakingProviderAppInfo<string>
}

export type StakingApplicationState = {
  parameters: FetchingState<AuthorizationParameters<string>>
  stakingProviders: FetchingState<StakingApplicationDataByStakingProvider>
}

export interface StakingApplicationsState {
  tbtc: StakingApplicationState
  randomBeacon: StakingApplicationState
}

export type StakingAppName = "tbtc" | "randomBeacon"

export const stakingApplicationsSlice = createSlice({
  name: "staking-applications",
  initialState: {
    tbtc: {
      parameters: {
        isFetching: false,
        error: "",
        data: {
          authorizationDecreaseChangePeriod: "0",
          minimumAuthorization: "0",
          authorizationDecreaseDelay: "0",
        },
      },
      stakingProviders: {
        isFetching: false,
        error: "",
        data: {},
      },
    },
    randomBeacon: {
      parameters: {
        isFetching: false,
        error: "",
        data: {
          authorizationDecreaseChangePeriod: "0",
          minimumAuthorization: "0",
          authorizationDecreaseDelay: "0",
        },
      },
      stakingProviders: {
        isFetching: false,
        error: "",
        data: {},
      },
    },
  } as StakingApplicationsState,
  reducers: {
    getSupportedApps: (state: StakingApplicationsState, action) => {},
    setAppParameters: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
        parameters: AuthorizationParameters<string>
      }>
    ) => {
      const { appName, parameters } = action.payload
      state[appName].parameters = {
        data: { ...parameters },
        isFetching: false,
        error: "",
      }
    },
    setAppParametersError: (
      state: StakingApplicationsState,
      action: PayloadAction<{ appName: StakingAppName; error: string }>
    ) => {
      const { appName, error } = action.payload
      state[appName].parameters.isFetching = false
      state[appName].parameters.error = error
    },
    fetchingAppParameters: (
      state: StakingApplicationsState,
      action: PayloadAction<{ appName: StakingAppName }>
    ) => {
      const { appName } = action.payload
      state[appName].parameters.isFetching = true
    },
    setStakingProvidersAppData: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
        data: StakingApplicationDataByStakingProvider
      }>
    ) => {
      const { appName, data } = action.payload
      state[appName].stakingProviders = {
        isFetching: false,
        error: "",
        data,
      }
    },
    fetchingStakingProvidersAppData: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
      }>
    ) => {
      const { appName } = action.payload
      state[appName].stakingProviders.isFetching = true
    },
    setStakingProvidersAppDataError: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        appName: StakingAppName
        error: string
      }>
    ) => {
      const { appName, error } = action.payload
      state[appName].stakingProviders.isFetching = false
      state[appName].stakingProviders.error = error
    },
    authorizationIncreased: (
      state: StakingApplicationsState,
      action: PayloadAction<{
        stakingProvider: string
        toAmount: string
        appName: StakingAppName
      }>
    ) => {
      const { stakingProvider, toAmount, appName } = action.payload
      if (state[appName].stakingProviders) {
        state[appName].stakingProviders.data[stakingProvider].authorizedStake =
          toAmount
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: AnyAction) => action.type.match(providerStaked),
      (state, action: ReturnType<typeof providerStaked>) => {
        const { stakingProvider } = action.payload

        const defaultAuthData = {
          authorizedStake: "0",
          pendingAuthorizationDecrease: "0",
          remainingAuthorizationDecreaseDelay: "0",
        }

        state.randomBeacon.stakingProviders.data[stakingProvider] = {
          ...defaultAuthData,
        }
        state.tbtc.stakingProviders.data[stakingProvider] = {
          ...defaultAuthData,
        }
      }
    )
  },
})

if (featureFlags.MULTI_APP_STAKING) {
  startAppListening({
    actionCreator: stakingApplicationsSlice.actions.getSupportedApps,
    effect: getSupportedAppsEffect,
  })

  startAppListening({
    actionCreator: setStakes,
    effect: getSupportedAppsStakingProvidersData,
  })

  startAppListening({
    predicate: shouldDisplayNewAppsToAuthorizeModal,
    effect: displayNewAppsToAuthorizeModalEffect,
  })
}
