import { FC } from "react"
import { List, ListItem, ListIcon, Button } from "@chakra-ui/react"
import { MdCheckCircle, MdRemoveCircle } from "react-icons/all"
import InfoBox from "../../InfoBox"
import Card from "../../Card"
import {
  StakeCardHeader,
  StakeCardHeaderTitle,
  StakeCardProviderAddress,
} from "../../../pages/Staking/StakeCard"
import TokenBalance from "../../TokenBalance"
import { Body2, H3 } from "../../Typography"
import ExternalLink from "../../ExternalLink"
import { dateToUnixTimestamp } from "../../../utils/date"
import { AddressZero } from "../../../web3/utils"
import { ExternalHref } from "../../../enums"
import { StakeData } from "../../../types/staking"
import { stakingBonus } from "../../../constants"

export const EligibilityCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const isFirstRequirementMet =
    stake.bonusEligibility.eligibleStakeAmount !== "0" &&
    stake.bonusEligibility.hasActiveStake &&
    !stake.bonusEligibility.hasUnstakeAfterBonusDeadline

  const isSecondRequirementMet = stake.bonusEligibility.hasPREConfigured

  const canTopUpStakeToGetBonus =
    stake.bonusEligibility.eligibleStakeAmount === "0" &&
    stake.bonusEligibility.hasActiveStake &&
    !stake.bonusEligibility.hasUnstakeAfterBonusDeadline &&
    dateToUnixTimestamp() < stakingBonus.BONUS_DEADLINE_TIMESTAMP

  return (
    <>
      <Card
        borderColor={
          !isFirstRequirementMet || !isSecondRequirementMet
            ? "red.200"
            : undefined
        }
      >
        <StakeCardHeader>
          <StakeCardHeaderTitle stake={stake} />
        </StakeCardHeader>
        <Body2 my="4">Staking Bonus</Body2>
        <TokenBalance
          tokenAmount={stake.bonusEligibility.reward}
          withSymbol
          tokenSymbol="T"
          isLarge
        />
        <StakeCardProviderAddress
          stakingProvider={stake.stakingProvider}
          mb="6"
          mt="4"
        />
        <RequirementList
          conditions={[isFirstRequirementMet, isSecondRequirementMet]}
        />
      </Card>
      {!isSecondRequirementMet && (
        <Button
          mt="4"
          as={ExternalLink}
          href={ExternalHref.preNodeSetup}
          text="Set PRE"
          textDecoration="none"
          isFullWidth
        />
      )}
      {canTopUpStakeToGetBonus && (
        <Button mt="4" isFullWidth>
          Top-up stake
        </Button>
      )}
    </>
  )
}

export const EmptyEligibilityCard: FC<{
  onClickStartStakingBtn: () => void
}> = ({ onClickStartStakingBtn }) => {
  return (
    <>
      <Card borderColor={"red.200"}>
        <StakeCardHeader>
          <StakeCardHeaderTitle stake={null} />
        </StakeCardHeader>
        <Body2 my="4">Staking Bonus</Body2>
        <H3>You have no stake yet</H3>
        <StakeCardProviderAddress stakingProvider={AddressZero} mb="6" mt="4" />
        <RequirementList conditions={[false, false]} />
      </Card>
      <Button mt="4" isFullWidth onClick={onClickStartStakingBtn}>
        Start Staking
      </Button>
    </>
  )
}

const RequirementList: FC<{ conditions: boolean[] }> = ({ conditions }) => {
  return (
    <InfoBox>
      <List spacing="4">
        <ListItem>
          <ListIcon
            width="24px"
            height="24px"
            as={conditions[0] ? MdCheckCircle : MdRemoveCircle}
            color={conditions[0] ? "green.500" : "red.500"}
          />
          Have an active stake before June the 1st
        </ListItem>
        <ListItem>
          <ListIcon
            width="24px"
            height="24px"
            as={conditions[1] ? MdCheckCircle : MdRemoveCircle}
            color={conditions[1] ? "green.500" : "red.500"}
          />
          PRE Node configured and working
        </ListItem>
      </List>
    </InfoBox>
  )
}