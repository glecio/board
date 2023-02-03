import NextAuth from "next-auth"
import { getToken } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session(session, profile){
      try{
        return{
          ...session,
          id: session.token.sub
        }

      }catch{
        return{
          ...session,
          id:null,
        }
      }

    },
    async signin(user, account, profile){
      const { email } = user
      try {
        return true
      } catch(err) {
          console.log('errroooo', err)
          return false
      }
    }
  }
}
export default NextAuth(authOptions)