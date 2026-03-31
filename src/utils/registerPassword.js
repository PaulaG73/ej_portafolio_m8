const MIN_LENGTH = 6

/** Letras latinas (incl. tildes) para exigir al menos una letra. */
const HAS_LETTER = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/
/** Al menos una mayúscula (incl. Ñ, vocales con tilde en mayúsculas habituales). */
const HAS_UPPER = /[A-ZÁÉÍÓÚÜÑ]/
const HAS_DIGIT = /\d/

/**
 * Reglas alineadas con el copy del formulario: ≥6 caracteres, letras y números,
 * al menos una mayúscula y un dígito.
 */
export function isRegisterPasswordValid (password) {
  if (typeof password !== 'string') return false
  if (password.length < MIN_LENGTH) return false
  if (!HAS_UPPER.test(password)) return false
  if (!HAS_DIGIT.test(password)) return false
  if (!HAS_LETTER.test(password)) return false
  return true
}

/** Misma leyenda para validación en cliente y para auth/weak-password en Firebase. */
export const REGISTER_PASSWORD_POLICY_MESSAGE =
  'La contraseña es demasiado débil: usa al menos 6 caracteres, letras y números, al menos una mayúscula y al menos un número.'
