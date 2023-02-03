import { signIn, signOut, useSession} from 'next-auth/react'
import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import Image from 'next/image'
 
export function SignInButton() {

    const {data:session} = useSession();

    return session ?(
        <button 
            type='button'
            className={styles.signInButton}
            onClick={ () => signOut()}
        >
        <Image src={session.session.user.image} alt="Steve" width={200} height={200} />
        Olá, {session.session.user.name}
        <FiX color='737380' className={styles.closeIcon} />
        </button>
    ) :
    (
        <button
            type='button'
            className={styles.signInButton}
            onClick={ () => signIn('github')}
        >
            <FaGithub color='FFB800'/>
            Entrar com Github
        </button>
    )
}