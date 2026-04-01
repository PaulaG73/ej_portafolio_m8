const MIN_LENGTH = 6

const HAS_LETTER = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/
const HAS_UPPER = /[A-ZÁÉÍÓÚÜÑ]/
const HAS_DIGIT = /\d/

export function isRegisterPasswordValid (password) {
  if (typeof password !== 'string') return false
  if (password.length < MIN_LENGTH) return false
  if (!HAS_UPPER.test(password)) return false
  if (!HAS_DIGIT.test(password)) return false
  if (!HAS_LETTER.test(password)) return false
  return true
}

export const REGISTER_PASSWORD_POLICY_MESSAGE =
  'La contraseña es demasiado débil: usa al menos 6 caracteres, letras y números, al menos una mayúscula y al menos un número.'
