import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
        firstName: vine.string().minLength(2).maxLength(255),
        name: vine.string().minLength(2).maxLength(255),
        // handle : vine.string(),
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(255),
    })
)

export const updateUserValidator = vine.compile(
    vine.object({
        firstName: vine.string().minLength(2).maxLength(255),
        name: vine.string().minLength(2).maxLength(255),
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(255),
    })
)

export const loginUserValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(255)
    })
)