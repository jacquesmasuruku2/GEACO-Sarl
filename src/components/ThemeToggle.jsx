import { useI18n } from '../i18n/useI18n'
import { useTheme } from '../theme/useTheme'

export function ThemeToggle() {
  const { t } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={t(isDark ? 'header.switchToLight' : 'header.switchToDark')}
      aria-pressed={isDark}
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
      <span>{t(isDark ? 'header.lightMode' : 'header.darkMode')}</span>
    </button>
  )
}
