import Retweet from '#models/retweet'
import type { HttpContext } from '@adonisjs/core/http'

export default class RetweetsController {
    public async store({auth, response, session, params}: HttpContext){
        auth.authenticate()

        const user = await auth.user!
        const tweetId = params.tweetId

         // Vérifier si le user a déjà retweeté
        const existing = await Retweet
        .query()
        .where('user_id', user.id)
        .andWhere('post_id', tweetId)
        .first()

        if (existing) {
            session.flash("error", "Vous avez deja retweeté")
            return response.redirect().back()
        }
        await Retweet.create({
            userId: user.id,
            postId: tweetId
        })
        session.flash("success", "Retweet avec succès")
        return response.redirect().back()
    }

    public async destroy({ auth, params, response, session }:HttpContext) {
        const user = auth.user!
        const tweetId = params.tweetId
      
        const retweet = await Retweet
          .query()
          .where('user_id', user.id)
          .andWhere('tweet_id', tweetId)
          .first()
      
        if (!retweet) {
          return response.notFound({ message: 'Retweet non trouvé' })
        }
        await retweet.delete()
      
        session.flash("success", "retweet supprimé")
    }
      
}