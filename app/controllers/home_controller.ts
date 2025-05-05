import Media from '#models/media';
import Post from '#models/post';
import { createTweetValidator } from '#validators/tweet';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';

    export default class HomeController {
      public async storeTweet({response, auth, request, session}: HttpContext) {
        try {
          await auth.authenticate()
        
          const content = request.input('content')
          let mediaFiles = request.files('mediaFiles')

          if (!content && (!mediaFiles || mediaFiles.length === 0)) {
              console.log("Impossible de tweeter du contenu vide.");
              session.flash("error", "Impossible de tweeter du contenu vide.");
              return response.redirect().back();
          }
          const tweet = await Post.create({
            userId: auth.user!.id,
            content,
          })
        
          // Normaliser les fichiers : un seul ou plusieurs
          if (!Array.isArray(mediaFiles)) {
            const singleFile = request.file('mediaFiles')
            mediaFiles = singleFile ? [singleFile] : []
          }
        
          console.log('Fichiers médias détectés :', mediaFiles.length)
        
          if (mediaFiles.length > 0) {
            for (const file of mediaFiles) {
              const fileName = `${new Date().getTime()}-${Math.random().toString(36).substring(2, 8)}.${file.extname}`
        
              await file.move(app.makePath('storage/uploads'), {
                name: fileName,
                overwrite: true,
              })
        
              await Media.create({
                postId: tweet.id,
                filePath: `${file.fileName}`,
                fileType: file.type,
              })
            }
          }
          console.log("Tweet créé avec succès");
          session.flash("success", "Tweet créé avec succès");
          return response.redirect().back()
        
        } catch (error) {
          console.error('Erreur lors de la création du post ou média :', error)
          return response.status(500).send('Une erreur est survenue.')
        }
      }
      public async index({ view }: HttpContext) {
        const imgProfilDefaul = "https://z-p3-scontent.ffih1-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=b224c7&_nc_eui2=AeGC841sZH8zzBskIuMDE7r6Wt9TLzuBU1Ba31MvO4FTUA4VovmnQhT7OiUGXw8Hul6Rvqfbkxd1O1yzcvTRuKjK&_nc_ohc=pCF_EXqQ5MYQ7kNvwFb7E1v&_nc_oc=Adn_D6LTN1pdIbeyJkgnRM6AfWZg3UOnpmVT7ZNcvT9T7K_cqNRDIZnpmphn9T3lEQM&_nc_pt=5&_nc_zt=24&_nc_ht=z-p3-scontent.ffih1-2.fna&oh=00_AfEYCkRgyR1URQuSWRKQE2UZD5g9Sx4W6ZqWNRAqpS1pMA&oe=6819257A";
        const tweets = await Post.query()
                        .preload('user', (userQuery) => {//charge l'utilisateur
                          userQuery.preload('profile') // Charge le profil de l'utilisateur
                        })
                        .preload('medias') // Charge les médias associés
                        .preload('likes')
                        //.preload('retweets')
                        .withCount('comments') // charge les commentaires du post
                        .withCount('retweets')
                        .orderBy('created_at', 'desc')
                        console.log(tweets)
        return view.render('pages/home', { tweets : tweets, imgProfilDefaul });
      }

      public async show({ response, params, auth }: HttpContext) {
        try {
          await auth.authenticate()
          const tweetId = params.id
          
          const tweet = await Post.query()
                .where('id', tweetId)
                .preload('user') // utilisateur qui a posté
                .preload('medias') // médias liés
                .preload('comments', (commentsQuery) => {
                  commentsQuery
                    .preload('user')
                    .orderBy('created_at', 'asc')
                })
                .firstOrFail()
    
          return response.json({
            success: true,
            data: tweet
          })
    
        } catch (error) {
          return response.status(error.status || 500).json({
            success: false,
            message: 'Tweet non trouvé ou erreur serveur'
          })
        }
      }    
    }
