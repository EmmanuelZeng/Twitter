import Like from '#models/like';
import type { HttpContext } from '@adonisjs/core/http'

export default class LikesController {
    public async like({auth, response, request, params}: HttpContext) {
        await auth.authenticate();
        const user = auth.user;
        const tweetId = params.id;

        try {
            const statusExistingLike = await Like.query()
            .where('postId', tweetId)
            .where('userId', user.id)
            .first();

            if (statusExistingLike) {
                statusExistingLike.status = !statusExistingLike.status;
                await statusExistingLike.save();
    
                return response.redirect().back();
            } else {
                await Like.create({
                    postId: tweetId,
                    userId: user.id,
                    status: true
                });
                
                return response.redirect().back();
            }
        } catch (error) {
            return response.status(500);
        }
    }
}
