import { FC } from "react"
import { StackProps, Stack, useStyleConfig } from "@chakra-ui/react"
import { H3 } from "../Typography"

const InfoBox: FC<{ text?: string; variant?: any } & StackProps> = ({
  text,
  children,
  ...props
}) => {
  const styles = useStyleConfig("InfoBox", props)

  return (
    <Stack __css={styles} {...props}>
      {text && <H3>{text}</H3>}
      {children}
    </Stack>
  )
}

export default InfoBox
