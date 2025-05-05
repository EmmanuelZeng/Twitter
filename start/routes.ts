/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';

const HomeController = () => import('#controllers/home_controller');
const ProfileController = () => import('#controllers/profiles_controller');
const AuthController = () => import('#controllers/auth/auth_controller');
const CommentController = () => import('#controllers/comments_controller');
const LikeController = () => import('#controllers/likes_controller');
const RetweetController = () => import('#controllers/retweets_controller');

/*
    Routes auth
*/
router.get('/register', [AuthController, 'register']).as('registerPage');
router.post('/storeUser', [AuthController, 'storeUser']).as('storeUser');

router.get('/login', [AuthController, 'login']).as('loginForm');
router.post('/login', [AuthController, 'loginUser']).as('loginUser')
router.post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())

router.group(()=> {
    router.get('/', [HomeController, 'index']);
    router.get('/home', [HomeController, 'index']).as('homePage');
    router.get('/:handle', [ProfileController, 'index']).as('profilePage');
    router.post('/profile/update', [ProfileController,'update']).as('profileupdate')
    router.post('/store', [HomeController, 'storeTweet']).as('storeTweet');
    router.get('/tweet/:id', [HomeController, 'show']).as('showTweet');
    router.post('/comment', [CommentController, 'storeComments']).as('comment');
    router.post('/tweet/:id/like', [LikeController, 'like']).as('like')
    router.post('/tweets/:tweetId/retweet', [RetweetController, 'store']).as('retweet')
    router.delete('/tweets/:tweetId/retweet', [RetweetController, 'destroy']).as('destroyRetweet');
}).use(middleware.auth());
