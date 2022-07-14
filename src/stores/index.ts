import type { Get } from 'type-fest'

import { getDefaultLanguage, Language, locales } from '@i18n'
import { useAtom } from 'jotai'
import { get } from 'lodash-es'
import { useCallback, useMemo } from 'react'
import { atomWithStorage } from 'jotai/utils'

const languageAtom = atomWithStorage('language', getDefaultLanguage())

export function useI18n() {
  const [defaultLang, setLang] = useAtom(languageAtom)
  const lang = useMemo(() => defaultLang ?? getDefaultLanguage(), [defaultLang])

  const translation = useCallback(
    function <Namespace extends keyof typeof Language['en_US']>(
      namespace?: Namespace
    ) {
      function t<Path extends string>(
        path: Path
      ): Get<typeof Language['en_US'][Namespace], Path> {
        return namespace ? get(Language[lang][namespace], path) : ''
      }
      return { t }
    },
    [lang]
  )

  return { lang, locales, setLang, translation }
}
