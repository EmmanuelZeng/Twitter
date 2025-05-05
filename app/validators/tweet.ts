import vine from '@vinejs/vine'

export const createTweetValidator = vine.compile(
    vine.object({
        // userId: vine.number(),
        content: vine.string().minLength(5).nullable()
    })
)