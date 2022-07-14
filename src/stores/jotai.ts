import type { Get } from 'type-fest'
import type { Lang } from '@i18n'

import { getDefaultLanguage, Language, locales } from '@i18n'
import { atom, useAtom } from 'jotai'
import { get } from 'lodash-es'
import { useCallback, useMemo } from 'react'
import { atomWithStorage } from 'jotai/utils'

const languageAtom = atomWithStorage<Lang | undefined>('language', undefined)

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

const jotaiStore = atom({
  a: 'a',
  b: 'b',
})

export function useTestJotaiStore() {
  const [data, set] = useAtom(jotaiStore)

  return { data, set }
}
