import { FC } from "react"
import { Icon, Stack } from "@chakra-ui/react"
import { Label3 } from "../../../../components/Typography"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingType } from "../../../../types/tbtc"

export const TbtcMintingCardTitle: FC = () => {
  const { mintingType } = useTbtcState()
  return (
    <Stack direction="row" mb={8}>
      <Icon boxSize="32px" as={tBTCFillBlack} />
      <Label3 textTransform="uppercase" pt="4px">
        {mintingType === TbtcMintingType.mint && "TBTC - Minting Process"}
        {mintingType === TbtcMintingType.unmint && "TBTC - Unminting Process"}
      </Label3>
    </Stack>
  )
}
