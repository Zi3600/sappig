import {useCallback} from 'react'
import {set, unset, type StringInputProps} from 'sanity'
import {Button, Flex, Stack, Text} from '@sanity/ui'

/* A row of one-click emoji plus the normal text field, so the owner can pick
   a common one instantly but is never limited to the list. */
const PRESETS = [
  '🥤', '🍹', '🥛', '🧋', '🧊', '☕', '🍵', '🥐',
  '🍽️', '🥗', '🍰', '🍪', '💪', '🌱', '🍋', '🍓',
  '🥑', '🌶️', '✨', '⭐', '🎉', '❄️', '☀️', '🎃',
]

export function EmojiInput(props: StringInputProps) {
  const {onChange, value} = props

  const pick = useCallback(
    (emoji: string) => onChange(emoji === value ? unset() : set(emoji)),
    [onChange, value],
  )

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Flex gap={1} wrap="wrap">
        {PRESETS.map((emoji) => (
          <Button
            key={emoji}
            mode={value === emoji ? 'default' : 'ghost'}
            tone={value === emoji ? 'primary' : 'default'}
            padding={2}
            fontSize={3}
            text={emoji}
            title={`Kies ${emoji}`}
            onClick={() => pick(emoji)}
          />
        ))}
      </Flex>
      <Text size={1} muted>
        Klik een emoji hierboven om hem te kiezen (nog eens klikken wist hem), of typ zelf iets in
        het veld. Windows: Win + . opent de emoji-kiezer.
      </Text>
    </Stack>
  )
}
