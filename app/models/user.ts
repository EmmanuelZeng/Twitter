import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Profile from '#models/profile'
import Link from '#models/link'
import ConnexionHistory from '#models/connexion_history'
import Follower from '#models/follower'
import Post from '#models/post'
import Like from '#models/like'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstName: string | null

  @column()
  declare name: string | null

  @column()
  declare handle : string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Link)
  declare links: HasMany<typeof Link>

  @hasMany(() => ConnexionHistory)
  declare connexionHistories: HasMany<typeof ConnexionHistory>

  @hasMany(() => Follower)
  declare followers: HasMany<typeof Follower>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Like)
  declare likes: HasMany<typeof Like>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}