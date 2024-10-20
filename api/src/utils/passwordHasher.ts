import crypto from "crypto"

const ITERATIONS = 1000
const KEY_LENGTH = 64
const ALGORITHM = "sha512"

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM)
    .toString("hex")

  return { salt, hash }
}

export const verifyPassword = (password: string, salt: string, hash: string) => {
  const hashToVerify = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, ALGORITHM)
    .toString("hex")

  return hash === hashToVerify
}
