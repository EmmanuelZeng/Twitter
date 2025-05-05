import vine from '@vinejs/vine'

export const createCommentValidator = vine.compile(
    vine.object({
        content: vine.string().minLength(1),
        postId: vine.number().exists({ table: 'posts', column: 'id' })
    })
)