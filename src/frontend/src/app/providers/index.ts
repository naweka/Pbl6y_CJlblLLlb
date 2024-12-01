import compose from 'compose-function'
import withRouter from './with-router'
import withTheme from './with-theme'
import withToaster from './with-toaster'

/**
 * @hoc Инициализирующая логика приложения
 * @remark Содержит:
 * - логику инициализации роутера (withRouter)
 * - логику инициализации темы (withTheme)
 */
export const withProviders = compose(withTheme, withToaster, withRouter)
