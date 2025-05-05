import Comment from '#models/comment';
import { createCommentValidator } from '#validators/comment';
import { Redirect, type HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
    public async storeComments({auth, session, request, response}: HttpContext) {
        const user = await auth.authenticate();
        const data = await request.validateUsing(createCommentValidator);
        console.log(data.content);
        try {
            if (!data.content || data.content.trim() === '') {
                session.flash("error", "Veuillez saisir un commentaire.");
                return response.redirect().back();
            }
            await Comment.create({
                userId: user.id,
                postId : data.postId,
                content : data.content
            })
            session.flash("success", "votre commentaire a été enregistré.")
            return response.redirect().back()
        } catch (error) {
            console.error("Impossible de commenter");
            session.flash("error", "Impossible de commenter");
        }
    }
}