/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { NexusResolverContext } from "./../nexus-graphql/context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "EmailAddress";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
    /**
     * A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
     */
    jwt<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JWT";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    email<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "EmailAddress";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
    /**
     * A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
     */
    jwt<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JWT";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ArObjectUpsertInput: { // input type
    arModels?: NexusGenScalars['JSON'] | null; // JSON
    artwork?: NexusGenScalars['JSON'] | null; // JSON
    askPrice?: number | null; // Float
    collector?: NexusGenScalars['JSON'] | null; // JSON
    creator?: NexusGenScalars['JSON'] | null; // JSON
    description: string; // String!
    editionOf?: number | null; // Int
    heroImage?: NexusGenScalars['JSON'] | null; // JSON
    id?: number | null; // Int
    images?: NexusGenScalars['JSON'] | null; // JSON
    key?: string | null; // String
    lat?: number | null; // Float
    lng?: number | null; // Float
    orderNumber?: number | null; // Int
    ownerEthAddress?: string | null; // String
    status?: number | null; // Int
    title: string; // String!
  }
  ArtworkUpsertInput: { // input type
    creator?: NexusGenScalars['JSON'] | null; // JSON
    description: string; // String!
    files?: NexusGenScalars['JSON'] | null; // JSON
    heroImage?: NexusGenScalars['JSON'] | null; // JSON
    id?: number | null; // Int
    images?: NexusGenScalars['JSON'] | null; // JSON
    key?: string | null; // String
    lat?: number | null; // Float
    lng?: number | null; // Float
    objects?: NexusGenScalars['JSON'] | null; // JSON
    status?: number | null; // Int
    title: string; // String!
    type?: number | null; // Int
    url?: string | null; // String
    video?: string | null; // String
  }
  ImageUpdateInput: { // input type
    meta: NexusGenScalars['JSON']; // JSON!
  }
  UserCreateInput: { // input type
    acceptedTerms: boolean; // Boolean!
    email: string; // String!
    firstName: string; // String!
    isBanned: boolean; // Boolean!
    lastName: string; // String!
    password: string; // String!
    role: string; // String!
  }
  UserProfileUpdateInput: { // input type
    bio: string; // String!
    email: NexusGenScalars['EmailAddress']; // EmailAddress!
    pseudonym: string; // String!
    url: string; // String!
  }
  UserSignupInput: { // input type
    acceptedTerms: boolean; // Boolean!
    email: NexusGenScalars['EmailAddress']; // EmailAddress!
    firstName: string; // String!
    lastName: string; // String!
    password: string; // String!
  }
  UserUpdateInput: { // input type
    bio: string; // String!
    isBanned: boolean; // Boolean!
    pseudonym: string; // String!
    role: string; // String!
    url: string; // String!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
  EmailAddress: any
  JSON: any
  JWT: any
}

export interface NexusGenObjects {
  ArModel: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    meta?: NexusGenScalars['JSON'] | null; // JSON
    nanoid?: string | null; // String
    orderNumber?: number | null; // Int
    status?: number | null; // Int
    type?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  ArModelStatus: { // root type
    id: number; // Int!
    meta?: NexusGenScalars['JSON'] | null; // JSON
    status: number; // Int!
  }
  ArObject: { // root type
    arModels?: Array<NexusGenRootTypes['ArModel'] | null> | null; // [ArModel]
    askPrice?: number | null; // Float
    collector?: NexusGenRootTypes['User'] | null; // User
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    creator?: NexusGenRootTypes['User'] | null; // User
    description?: string | null; // String
    editionOf?: number | null; // Int
    heroImage?: NexusGenRootTypes['Image'] | null; // Image
    id: number; // Int!
    images?: Array<NexusGenRootTypes['Image'] | null> | null; // [Image]
    isBanned?: boolean | null; // Boolean
    key?: string | null; // String
    lat?: number | null; // Float
    lng?: number | null; // Float
    orderNumber?: number | null; // Int
    ownerEthAddress?: string | null; // String
    public?: boolean | null; // Boolean
    status: number; // Int!
    title?: string | null; // String
    type?: number | null; // Int
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    url?: string | null; // String
    video?: string | null; // String
  }
  ArObjectQueryResult: { // root type
    arObjects?: Array<NexusGenRootTypes['ArObject'] | null> | null; // [ArObject]
    totalCount?: number | null; // Int
  }
  Artwork: { // root type
    arObjects?: Array<NexusGenRootTypes['ArObject'] | null> | null; // [ArObject]
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    creator?: NexusGenRootTypes['User'] | null; // User
    description?: string | null; // String
    heroImage?: NexusGenRootTypes['Image'] | null; // Image
    id: number; // Int!
    key?: string | null; // String
    lat?: number | null; // Float
    lng?: number | null; // Float
    status: number; // Int!
    title?: string | null; // String
    type?: number | null; // Int
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    url?: string | null; // String
    video?: string | null; // String
  }
  ArtworkQueryResult: { // root type
    artworks?: Array<NexusGenRootTypes['Artwork'] | null> | null; // [Artwork]
    totalCount?: number | null; // Int
  }
  AuthPayload: { // root type
    tokens?: NexusGenRootTypes['AuthPayloadTokens'] | null; // AuthPayloadTokens
    user?: NexusGenRootTypes['AuthUser'] | null; // AuthUser
  }
  AuthPayloadToken: { // root type
    expires: string; // String!
    token?: NexusGenScalars['JWT'] | null; // JWT
  }
  AuthPayloadTokens: { // root type
    access?: NexusGenRootTypes['AuthPayloadToken'] | null; // AuthPayloadToken
    refresh?: NexusGenRootTypes['AuthPayloadToken'] | null; // AuthPayloadToken
    sign?: NexusGenRootTypes['AuthPayloadToken'] | null; // AuthPayloadToken
  }
  AuthUser: { // root type
    email?: string | null; // String
    ethAddress: string; // String!
    id: number; // Int!
    isNew?: boolean | null; // Boolean
    message?: string | null; // String
    permissions?: Array<string | null> | null; // [String]
    pseudonym?: string | null; // String
    roles?: Array<string | null> | null; // [String]
  }
  BooleanResult: { // root type
    result: boolean; // Boolean!
  }
  Exhibition: { // root type
    artworks?: Array<NexusGenRootTypes['Artwork'] | null> | null; // [Artwork]
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    curators?: NexusGenRootTypes['User'] | null; // User
    dateBegin?: NexusGenScalars['DateTime'] | null; // DateTime
    dateEnd?: NexusGenScalars['DateTime'] | null; // DateTime
    description?: string | null; // String
    id: number; // Int!
    slug?: NexusGenScalars['JSON'] | null; // JSON
    status: number; // Int!
    subtitle?: string | null; // String
    title?: NexusGenScalars['JSON'] | null; // JSON
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  GeoPoint: { // root type
    lat?: number | null; // Float
    lng?: number | null; // Float
  }
  Image: { // root type
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    meta?: NexusGenScalars['JSON'] | null; // JSON
    nanoid?: string | null; // String
    orderNumber?: number | null; // Int
    status?: number | null; // Int
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  ImageQueryResult: { // root type
    images?: Array<NexusGenRootTypes['Image'] | null> | null; // [Image]
    totalCount?: number | null; // Int
  }
  ImageStatus: { // root type
    id: number; // Int!
    meta?: NexusGenScalars['JSON'] | null; // JSON
    status: number; // Int!
  }
  Mutation: {};
  PublicUser: { // root type
    bio?: string | null; // String
    email?: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    emailVerified?: boolean | null; // Boolean
    ethAddress?: string | null; // String
    id: number; // Int!
    profileImageId?: number | null; // Int
    pseudonym?: string | null; // String
    roles?: Array<string | null> | null; // [String]
    url?: string | null; // String
  }
  Query: {};
  User: { // root type
    bio?: string | null; // String
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    email?: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    emailVerified?: boolean | null; // Boolean
    ethAddress?: string | null; // String
    id: number; // Int!
    isBanned?: boolean | null; // Boolean
    profileImageId?: number | null; // Int
    pseudonym?: string | null; // String
    roles?: Array<string | null> | null; // [String]
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
    url?: string | null; // String
  }
  UsersQueryResult: { // root type
    totalCount?: number | null; // Int
    users?: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
}

export interface NexusGenInterfaces {
  UserBaseNode: NexusGenRootTypes['PublicUser'] | NexusGenRootTypes['User'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  ArModel: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    meta: NexusGenScalars['JSON'] | null; // JSON
    nanoid: string | null; // String
    orderNumber: number | null; // Int
    status: number | null; // Int
    type: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  ArModelStatus: { // field return type
    id: number; // Int!
    meta: NexusGenScalars['JSON'] | null; // JSON
    status: number; // Int!
  }
  ArObject: { // field return type
    arModels: Array<NexusGenRootTypes['ArModel'] | null> | null; // [ArModel]
    askPrice: number | null; // Float
    collector: NexusGenRootTypes['User'] | null; // User
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    creator: NexusGenRootTypes['User'] | null; // User
    description: string | null; // String
    editionOf: number | null; // Int
    heroImage: NexusGenRootTypes['Image'] | null; // Image
    id: number; // Int!
    images: Array<NexusGenRootTypes['Image'] | null> | null; // [Image]
    isBanned: boolean | null; // Boolean
    key: string | null; // String
    lat: number | null; // Float
    lng: number | null; // Float
    orderNumber: number | null; // Int
    ownerEthAddress: string | null; // String
    public: boolean | null; // Boolean
    status: number; // Int!
    title: string | null; // String
    type: number | null; // Int
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    url: string | null; // String
    video: string | null; // String
  }
  ArObjectQueryResult: { // field return type
    arObjects: Array<NexusGenRootTypes['ArObject'] | null> | null; // [ArObject]
    totalCount: number | null; // Int
  }
  Artwork: { // field return type
    arObjects: Array<NexusGenRootTypes['ArObject'] | null> | null; // [ArObject]
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    creator: NexusGenRootTypes['User'] | null; // User
    description: string | null; // String
    heroImage: NexusGenRootTypes['Image'] | null; // Image
    id: number; // Int!
    key: string | null; // String
    lat: number | null; // Float
    lng: number | null; // Float
    status: number; // Int!
    title: string | null; // String
    type: number | null; // Int
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    url: string | null; // String
    video: string | null; // String
  }
  ArtworkQueryResult: { // field return type
    artworks: Array<NexusGenRootTypes['Artwork'] | null> | null; // [Artwork]
    totalCount: number | null; // Int
  }
  AuthPayload: { // field return type
    tokens: NexusGenRootTypes['AuthPayloadTokens'] | null; // AuthPayloadTokens
    user: NexusGenRootTypes['AuthUser'] | null; // AuthUser
  }
  AuthPayloadToken: { // field return type
    expires: string; // String!
    token: NexusGenScalars['JWT'] | null; // JWT
  }
  AuthPayloadTokens: { // field return type
    access: NexusGenRootTypes['AuthPayloadToken'] | null; // AuthPayloadToken
    refresh: NexusGenRootTypes['AuthPayloadToken'] | null; // AuthPayloadToken
    sign: NexusGenRootTypes['AuthPayloadToken'] | null; // AuthPayloadToken
  }
  AuthUser: { // field return type
    email: string | null; // String
    ethAddress: string; // String!
    id: number; // Int!
    isNew: boolean | null; // Boolean
    message: string | null; // String
    permissions: Array<string | null> | null; // [String]
    pseudonym: string | null; // String
    roles: Array<string | null> | null; // [String]
  }
  BooleanResult: { // field return type
    result: boolean; // Boolean!
  }
  Exhibition: { // field return type
    artworks: Array<NexusGenRootTypes['Artwork'] | null> | null; // [Artwork]
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    curators: NexusGenRootTypes['User'] | null; // User
    dateBegin: NexusGenScalars['DateTime'] | null; // DateTime
    dateEnd: NexusGenScalars['DateTime'] | null; // DateTime
    description: string | null; // String
    id: number; // Int!
    slug: NexusGenScalars['JSON'] | null; // JSON
    status: number; // Int!
    subtitle: string | null; // String
    title: NexusGenScalars['JSON'] | null; // JSON
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  GeoPoint: { // field return type
    lat: number | null; // Float
    lng: number | null; // Float
  }
  Image: { // field return type
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    meta: NexusGenScalars['JSON'] | null; // JSON
    nanoid: string | null; // String
    orderNumber: number | null; // Int
    status: number | null; // Int
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  ImageQueryResult: { // field return type
    images: Array<NexusGenRootTypes['Image'] | null> | null; // [Image]
    totalCount: number | null; // Int
  }
  ImageStatus: { // field return type
    id: number; // Int!
    meta: NexusGenScalars['JSON'] | null; // JSON
    status: number; // Int!
  }
  Mutation: { // field return type
    arModelDelete: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    arObjectCreate: NexusGenRootTypes['ArObject']; // ArObject!
    arObjectDelete: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    arObjectUpdate: NexusGenRootTypes['ArObject']; // ArObject!
    artworkCreate: NexusGenRootTypes['Artwork']; // Artwork!
    artworkDelete: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    artworkUpdate: NexusGenRootTypes['Artwork']; // Artwork!
    authLogin: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    authLogout: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    authPreLogin: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    authRefresh: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    authRequestEmailVerificationEmail: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    authVerifyEmail: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    imageDelete: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    imageUpdate: NexusGenRootTypes['Image']; // Image!
    userCreate: NexusGenRootTypes['User']; // User!
    userDelete: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    userProfileImageDelete: NexusGenRootTypes['BooleanResult']; // BooleanResult!
    userProfileUpdate: NexusGenRootTypes['User']; // User!
    userUpdate: NexusGenRootTypes['BooleanResult']; // BooleanResult!
  }
  PublicUser: { // field return type
    bio: string | null; // String
    email: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    emailVerified: boolean | null; // Boolean
    ethAddress: string | null; // String
    id: number; // Int!
    profileImage: NexusGenRootTypes['Image'] | null; // Image
    profileImageId: number | null; // Int
    pseudonym: string | null; // String
    roles: Array<string | null> | null; // [String]
    url: string | null; // String
  }
  Query: { // field return type
    arModelRead: NexusGenRootTypes['ArModel']; // ArModel!
    arModelStatus: NexusGenRootTypes['ArModelStatus']; // ArModelStatus!
    arObject: NexusGenRootTypes['ArObject']; // ArObject!
    arObjectReadOwn: NexusGenRootTypes['ArObject']; // ArObject!
    arObjects: NexusGenRootTypes['ArObjectQueryResult'] | null; // ArObjectQueryResult
    arObjectsReadOwn: NexusGenRootTypes['ArObjectQueryResult'] | null; // ArObjectQueryResult
    artwork: NexusGenRootTypes['Artwork']; // Artwork!
    artworkReadOwn: NexusGenRootTypes['Artwork']; // Artwork!
    artworks: NexusGenRootTypes['ArtworkQueryResult'] | null; // ArtworkQueryResult
    artworksReadOwn: NexusGenRootTypes['ArtworkQueryResult'] | null; // ArtworkQueryResult
    exhibition: NexusGenRootTypes['Exhibition']; // Exhibition!
    imageRead: NexusGenRootTypes['Image']; // Image!
    imageStatus: NexusGenRootTypes['ImageStatus']; // ImageStatus!
    images: NexusGenRootTypes['ImageQueryResult'] | null; // ImageQueryResult
    userByEthAddress: NexusGenRootTypes['User']; // User!
    userProfileRead: NexusGenRootTypes['PublicUser']; // PublicUser!
    userRead: NexusGenRootTypes['User']; // User!
    users: NexusGenRootTypes['UsersQueryResult'] | null; // UsersQueryResult
  }
  User: { // field return type
    bio: string | null; // String
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    email: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    emailVerified: boolean | null; // Boolean
    ethAddress: string | null; // String
    id: number; // Int!
    isBanned: boolean | null; // Boolean
    profileImage: NexusGenRootTypes['Image'] | null; // Image
    profileImageId: number | null; // Int
    pseudonym: string | null; // String
    roles: Array<string | null> | null; // [String]
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
    url: string | null; // String
  }
  UsersQueryResult: { // field return type
    totalCount: number | null; // Int
    users: Array<NexusGenRootTypes['User'] | null> | null; // [User]
  }
  UserBaseNode: { // field return type
    bio: string | null; // String
    email: NexusGenScalars['EmailAddress'] | null; // EmailAddress
    emailVerified: boolean | null; // Boolean
    ethAddress: string | null; // String
    id: number; // Int!
    profileImage: NexusGenRootTypes['Image'] | null; // Image
    profileImageId: number | null; // Int
    pseudonym: string | null; // String
    roles: Array<string | null> | null; // [String]
    url: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  ArModel: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    meta: 'JSON'
    nanoid: 'String'
    orderNumber: 'Int'
    status: 'Int'
    type: 'String'
    updatedAt: 'DateTime'
  }
  ArModelStatus: { // field return type name
    id: 'Int'
    meta: 'JSON'
    status: 'Int'
  }
  ArObject: { // field return type name
    arModels: 'ArModel'
    askPrice: 'Float'
    collector: 'User'
    createdAt: 'DateTime'
    creator: 'User'
    description: 'String'
    editionOf: 'Int'
    heroImage: 'Image'
    id: 'Int'
    images: 'Image'
    isBanned: 'Boolean'
    key: 'String'
    lat: 'Float'
    lng: 'Float'
    orderNumber: 'Int'
    ownerEthAddress: 'String'
    public: 'Boolean'
    status: 'Int'
    title: 'String'
    type: 'Int'
    updatedAt: 'DateTime'
    url: 'String'
    video: 'String'
  }
  ArObjectQueryResult: { // field return type name
    arObjects: 'ArObject'
    totalCount: 'Int'
  }
  Artwork: { // field return type name
    arObjects: 'ArObject'
    createdAt: 'DateTime'
    creator: 'User'
    description: 'String'
    heroImage: 'Image'
    id: 'Int'
    key: 'String'
    lat: 'Float'
    lng: 'Float'
    status: 'Int'
    title: 'String'
    type: 'Int'
    updatedAt: 'DateTime'
    url: 'String'
    video: 'String'
  }
  ArtworkQueryResult: { // field return type name
    artworks: 'Artwork'
    totalCount: 'Int'
  }
  AuthPayload: { // field return type name
    tokens: 'AuthPayloadTokens'
    user: 'AuthUser'
  }
  AuthPayloadToken: { // field return type name
    expires: 'String'
    token: 'JWT'
  }
  AuthPayloadTokens: { // field return type name
    access: 'AuthPayloadToken'
    refresh: 'AuthPayloadToken'
    sign: 'AuthPayloadToken'
  }
  AuthUser: { // field return type name
    email: 'String'
    ethAddress: 'String'
    id: 'Int'
    isNew: 'Boolean'
    message: 'String'
    permissions: 'String'
    pseudonym: 'String'
    roles: 'String'
  }
  BooleanResult: { // field return type name
    result: 'Boolean'
  }
  Exhibition: { // field return type name
    artworks: 'Artwork'
    createdAt: 'DateTime'
    curators: 'User'
    dateBegin: 'DateTime'
    dateEnd: 'DateTime'
    description: 'String'
    id: 'Int'
    slug: 'JSON'
    status: 'Int'
    subtitle: 'String'
    title: 'JSON'
    updatedAt: 'DateTime'
  }
  GeoPoint: { // field return type name
    lat: 'Float'
    lng: 'Float'
  }
  Image: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    meta: 'JSON'
    nanoid: 'String'
    orderNumber: 'Int'
    status: 'Int'
    updatedAt: 'DateTime'
  }
  ImageQueryResult: { // field return type name
    images: 'Image'
    totalCount: 'Int'
  }
  ImageStatus: { // field return type name
    id: 'Int'
    meta: 'JSON'
    status: 'Int'
  }
  Mutation: { // field return type name
    arModelDelete: 'BooleanResult'
    arObjectCreate: 'ArObject'
    arObjectDelete: 'BooleanResult'
    arObjectUpdate: 'ArObject'
    artworkCreate: 'Artwork'
    artworkDelete: 'BooleanResult'
    artworkUpdate: 'Artwork'
    authLogin: 'AuthPayload'
    authLogout: 'BooleanResult'
    authPreLogin: 'AuthPayload'
    authRefresh: 'AuthPayload'
    authRequestEmailVerificationEmail: 'BooleanResult'
    authVerifyEmail: 'BooleanResult'
    imageDelete: 'BooleanResult'
    imageUpdate: 'Image'
    userCreate: 'User'
    userDelete: 'BooleanResult'
    userProfileImageDelete: 'BooleanResult'
    userProfileUpdate: 'User'
    userUpdate: 'BooleanResult'
  }
  PublicUser: { // field return type name
    bio: 'String'
    email: 'EmailAddress'
    emailVerified: 'Boolean'
    ethAddress: 'String'
    id: 'Int'
    profileImage: 'Image'
    profileImageId: 'Int'
    pseudonym: 'String'
    roles: 'String'
    url: 'String'
  }
  Query: { // field return type name
    arModelRead: 'ArModel'
    arModelStatus: 'ArModelStatus'
    arObject: 'ArObject'
    arObjectReadOwn: 'ArObject'
    arObjects: 'ArObjectQueryResult'
    arObjectsReadOwn: 'ArObjectQueryResult'
    artwork: 'Artwork'
    artworkReadOwn: 'Artwork'
    artworks: 'ArtworkQueryResult'
    artworksReadOwn: 'ArtworkQueryResult'
    exhibition: 'Exhibition'
    imageRead: 'Image'
    imageStatus: 'ImageStatus'
    images: 'ImageQueryResult'
    userByEthAddress: 'User'
    userProfileRead: 'PublicUser'
    userRead: 'User'
    users: 'UsersQueryResult'
  }
  User: { // field return type name
    bio: 'String'
    createdAt: 'DateTime'
    email: 'EmailAddress'
    emailVerified: 'Boolean'
    ethAddress: 'String'
    id: 'Int'
    isBanned: 'Boolean'
    profileImage: 'Image'
    profileImageId: 'Int'
    pseudonym: 'String'
    roles: 'String'
    updatedAt: 'DateTime'
    url: 'String'
  }
  UsersQueryResult: { // field return type name
    totalCount: 'Int'
    users: 'User'
  }
  UserBaseNode: { // field return type name
    bio: 'String'
    email: 'EmailAddress'
    emailVerified: 'Boolean'
    ethAddress: 'String'
    id: 'Int'
    profileImage: 'Image'
    profileImageId: 'Int'
    pseudonym: 'String'
    roles: 'String'
    url: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    arModelDelete: { // args
      id: number; // Int!
    }
    arObjectCreate: { // args
      data: NexusGenInputs['ArObjectUpsertInput']; // ArObjectUpsertInput!
    }
    arObjectDelete: { // args
      id: number; // Int!
    }
    arObjectUpdate: { // args
      data: NexusGenInputs['ArObjectUpsertInput']; // ArObjectUpsertInput!
      id: number; // Int!
    }
    artworkCreate: { // args
      data: NexusGenInputs['ArtworkUpsertInput']; // ArtworkUpsertInput!
    }
    artworkDelete: { // args
      id: number; // Int!
    }
    artworkUpdate: { // args
      data: NexusGenInputs['ArtworkUpsertInput']; // ArtworkUpsertInput!
      id: number; // Int!
    }
    authLogin: { // args
      ethAddress: string; // String!
      signedMessage: string; // String!
    }
    authLogout: { // args
      userId: number; // Int!
    }
    authPreLogin: { // args
      ethAddress: string; // String!
    }
    authRequestEmailVerificationEmail: { // args
      userId: number; // Int!
    }
    authVerifyEmail: { // args
      token: string; // String!
    }
    imageDelete: { // args
      id: number; // Int!
    }
    imageUpdate: { // args
      data: NexusGenInputs['ImageUpdateInput']; // ImageUpdateInput!
      id: number; // Int!
    }
    userCreate: { // args
      data: NexusGenInputs['UserCreateInput']; // UserCreateInput!
    }
    userDelete: { // args
      id: number; // Int!
    }
    userProfileImageDelete: { // args
      id: number; // Int!
    }
    userProfileUpdate: { // args
      data: NexusGenInputs['UserProfileUpdateInput']; // UserProfileUpdateInput!
      id: number; // Int!
    }
    userUpdate: { // args
      data: NexusGenInputs['UserUpdateInput']; // UserUpdateInput!
      id: number; // Int!
    }
  }
  Query: {
    arModelRead: { // args
      id: number; // Int!
    }
    arModelStatus: { // args
      id: number; // Int!
    }
    arObject: { // args
      key: string; // String!
    }
    arObjectReadOwn: { // args
      id: number; // Int!
    }
    arObjects: { // args
      orderBy?: NexusGenScalars['JSON'] | null; // JSON
      pageIndex?: number | null; // Int
      pageSize: number | null; // Int
      where?: NexusGenScalars['JSON'] | null; // JSON
    }
    arObjectsReadOwn: { // args
      orderBy?: NexusGenScalars['JSON'] | null; // JSON
      pageIndex?: number | null; // Int
      pageSize: number | null; // Int
      where?: NexusGenScalars['JSON'] | null; // JSON
    }
    artwork: { // args
      key: string; // String!
    }
    artworkReadOwn: { // args
      id: number; // Int!
    }
    artworks: { // args
      orderBy?: NexusGenScalars['JSON'] | null; // JSON
      pageIndex?: number | null; // Int
      pageSize: number | null; // Int
      where?: NexusGenScalars['JSON'] | null; // JSON
    }
    artworksReadOwn: { // args
      orderBy?: NexusGenScalars['JSON'] | null; // JSON
      pageIndex?: number | null; // Int
      pageSize: number | null; // Int
      where?: NexusGenScalars['JSON'] | null; // JSON
    }
    exhibition: { // args
      slug: string; // String!
    }
    imageRead: { // args
      id: number; // Int!
    }
    imageStatus: { // args
      id: number; // Int!
    }
    images: { // args
      orderBy?: NexusGenScalars['JSON'] | null; // JSON
      pageIndex?: number | null; // Int
      pageSize: number | null; // Int
      taxonomyId?: number | null; // Int
      where?: NexusGenScalars['JSON'] | null; // JSON
    }
    userByEthAddress: { // args
      ethAddress: string; // String!
    }
    userProfileRead: { // args
      id: number; // Int!
    }
    userRead: { // args
      id: number; // Int!
    }
    users: { // args
      orderBy?: NexusGenScalars['JSON'] | null; // JSON
      pageIndex?: number | null; // Int
      pageSize: number | null; // Int
      where?: NexusGenScalars['JSON'] | null; // JSON
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  UserBaseNode: "PublicUser" | "User"
}

export interface NexusGenTypeInterfaces {
  PublicUser: "UserBaseNode"
  User: "UserBaseNode"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "UserBaseNode";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: NexusResolverContext;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}