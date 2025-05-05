import User from '#models/user'
import { createUserValidator, loginUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { isNull } from '@sindresorhus/is'
import { messages } from '@vinejs/vine/defaults'

export default class AuthController {
    public async register({ view }: HttpContext) {
        return view.render('auth/register')
    }

    public async storeUser({ request, response, session, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(createUserValidator)
            const findUser = await User.findBy('email', payload.email)
            if (findUser) {
                session.flash('error', "L'email est déjà utilisé")
                return response.redirect().back()
            }

            
            // Générer un handle_name à partir du first_name et name
            const handle = `${payload.firstName.toLowerCase()}_${payload.name.toLowerCase()}`
            // Option: remplacer les espaces et caractères spéciaux
            const cleanHandle = handle.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')

            const addUser = await User.create({
                ...payload,
                handle: cleanHandle
            })

            await addUser.related('profile').create({
                photo: '',
                biography: '',
                locate: '',
                birthDay: new Date()
            })
            await auth.use('web').login(addUser)
            console.log('User create')
            session.flash('success', "L'utilisateur a été créé avec succès")
            return response.redirect().toRoute('homePage')
        } catch (error) {
            console.error('Registration error:', error)
            session.flash('error', "Une erreur est survenue lors de la création de l'utilisateur. Veuillez vérifier les champs du formulaire")
            return response.redirect().back()
        }
    }

    public async login({view}: HttpContext) {
        return view.render('auth/login');
    }

    public async loginUser({response, session, auth, request}: HttpContext) {
        const data = request.all();
        const payload = await loginUserValidator.validate(data);

        try {
            const user = await User.verifyCredentials(payload.email, payload.password);
            await auth.use('web').login(user);
            return response.redirect().toRoute('/home', {isAuthenticated:true, user: user})
        } catch (error) {
            session.flash('error', "Email ou mot de passe invalide");
            return response.redirect().back()
        }
    }

    public async logout({response, auth}: HttpContext) {
        await auth.use('web').logout();
        return response.redirect().toRoute('/login')
    }
}