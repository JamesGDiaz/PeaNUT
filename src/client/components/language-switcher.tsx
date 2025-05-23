import { HiOutlineLanguage } from 'react-icons/hi2'
import React, { useContext } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/client/components/ui/dropdown-menu'
import { Button } from '@/client/components/ui/button'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { LanguageContext } from '@/client/context/language'

const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'ro', label: 'Română', flag: '🇷🇴' },
]

export default function LanguageSwitcher() {
  const lng = useContext<string>(LanguageContext)
  const { t, i18n } = useTranslation(lng)
  const [language, setLanguage] = React.useState(i18next.language)

  const handleSelect = (language: string) => {
    i18n.changeLanguage(language)
  }

  const isActive = (value: string) => {
    return language === value ? 'bg-secondary-highlight!' : ''
  }

  React.useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18next.language)
    }

    i18next.on('languageChanged', handleLanguageChange)

    return () => {
      i18next.off('languageChanged', handleLanguageChange)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid='language-trigger'>
        <Button size='icon' variant='ghost' title={t('sidebar.language')} className='cursor-pointer px-3'>
          <HiOutlineLanguage className='size-6!' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ul className='grid grid-cols-2 gap-1 outline-hidden outline-0'>
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.value}
              className={`cursor-pointer ${isActive(language.value)}`.trim()}
              onClick={() => handleSelect(language.value)}
            >
              {language.flag}&nbsp;{language.label}
            </DropdownMenuItem>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
