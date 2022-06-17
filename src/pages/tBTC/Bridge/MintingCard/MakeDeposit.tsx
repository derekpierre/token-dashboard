import { FC } from "react"
import { Box, Button, Image, HStack, Stack, Tag } from "@chakra-ui/react"
import btcQrTmp from "./BTC_QA_TMP.png"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "./TbtcMintingCardSubtitle"
import { Body2 } from "../../../../components/Typography"
import InfoBox from "../../../../components/InfoBox"
import TooltipIcon from "../../../../components/TooltipIcon"
import CopyToClipboard from "../../../../components/CopyToClipboard"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"

const AddressRow: FC<{ address: string; text: string }> = ({
  address,
  text,
}) => {
  return (
    <HStack justify="space-between">
      <Tag size="md" variant="subtle" colorScheme="brand">
        {text}
      </Tag>
      <HStack>
        <Body2 color="brand.500">{shortenAddress(address)}</Body2>
        <CopyToClipboard textToCopy={address} />
      </HStack>
    </HStack>
  )
}

export const MakeDeposit: FC = () => {
  const handleSubmit = () => {
    console.log("yo")
  }

  const { btcDepositAddress, ethAddress, btcRecoveryAddress } = useTbtcState()

  return (
    <Box>
      <TbtcMintingCardTitle />
      <TbtcMintingCardSubTitle
        stepText="Step 2"
        subTitle="Make your BTC deposit"
      />
      <Body2 color="gray.500" mb={6}>
        Use this generated address to send any amount of BTC you want to mint as
        tBTC.
      </Body2>
      <Body2 color="gray.500" mb={6}>
        This address is an unique generated address based on the data you
        provided.
      </Body2>
      <InfoBox>
        <HStack>
          <Body2 color="gray.700">BTC Deposit Address</Body2>
          <TooltipIcon label="This is an unique BTC address generated based on the ETH address and Recovery address you provided. Send your BTC funds to this address in order to mint tBTC." />
        </HStack>

        {/* TODO: Generate this QR Code */}
        <Image
          my={6}
          mx="auto"
          bg="white"
          borderRadius="lg"
          maxW="145px"
          maxH="145px"
          src={btcQrTmp}
        />

        <HStack bg="white" borderRadius="lg" justify="space-between" px={4}>
          <Body2 color="brand.500">{btcDepositAddress}</Body2>
          <CopyToClipboard textToCopy={btcDepositAddress} />
        </HStack>
      </InfoBox>
      <Stack spacing={4} mb={8}>
        <Body2>Provided Addresses Recap</Body2>
        <AddressRow text="ETH Address" address={ethAddress} />
        <AddressRow text="BTC Recovery Address" address={btcRecoveryAddress} />
      </Stack>
      <Button onClick={handleSubmit} form="tbtc-minting-data-form" isFullWidth>
        I sent the BTC
      </Button>
    </Box>
  )
}
