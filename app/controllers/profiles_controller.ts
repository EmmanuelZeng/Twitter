import Profile from '#models/profile';
import User from '#models/user';
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
    public async index({ view, params, response }: HttpContext) {
        try {
            const handleUser = params.handle
            const user = await User.query()
            .preload('profile')
            .preload('posts', (postQuery) => {
                postQuery
                .preload('user')
                .preload('likes')
                .preload('medias')
                .withCount('likes')
                .withCount('comments')
                .withCount('retweets')
            })
            .withCount('posts')
            .where('handle', handleUser)
            .firstOrFail()

            const imgProfilDefaul = "https://z-p3-scontent.ffih1-2.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=b224c7&_nc_eui2=AeGC841sZH8zzBskIuMDE7r6Wt9TLzuBU1Ba31MvO4FTUA4VovmnQhT7OiUGXw8Hul6Rvqfbkxd1O1yzcvTRuKjK&_nc_ohc=pCF_EXqQ5MYQ7kNvwFb7E1v&_nc_oc=Adn_D6LTN1pdIbeyJkgnRM6AfWZg3UOnpmVT7ZNcvT9T7K_cqNRDIZnpmphn9T3lEQM&_nc_pt=5&_nc_zt=24&_nc_ht=z-p3-scontent.ffih1-2.fna&oh=00_AfEYCkRgyR1URQuSWRKQE2UZD5g9Sx4W6ZqWNRAqpS1pMA&oe=6819257A";
            console.log(user)
            if(!user) {
                return view.render('pages/errors/not_found')
            }
            return view.render('pages/profile', { user, imgProfilDefaul })
        } catch (error) {
            return response.status(400).abort("Aucun profile trouvé");
        }
    }

    public async update({request, response, auth, session}: HttpContext) {
        const user = auth.user!
        await user.load('profile')
        

        const data = request.only(['firstName', 'name', 'biography', 'locate', 'birthDay']);
        let profile: Profile | null = user.profile
        try {
            if (!profile) {
                profile = await user.related('profile').create(data)
            } else {
                profile.merge(data)
                await profile.save()
            }

            session.flash("success","Profil mis à jour avec succès")
            return response.redirect().back();
        } catch (error) {
            session.flash("error","Une erreur est survenue lors de la mise à jour du profil")
            return response.redirect().back();
        }
    }
}