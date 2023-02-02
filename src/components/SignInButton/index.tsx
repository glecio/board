import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import Image from 'next/image'
import { signIn, signOut, useSession} from 'next-auth/client'
 
export function SignInButton() {

    const [session] = useSession();

    console.log(session)
    return session ?(
        <button 
            type='button'
            className={styles.signInButton}
            onClick={ () => signOut()}
        >
        <Image src="/images/steve.png" alt="Steve" width={200} height={200} />
        Olá, Steve
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