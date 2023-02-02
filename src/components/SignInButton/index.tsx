import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import Image from 'next/image'
 
export function SignInButton() {

    const session = true;

    return session ?(
        <button 
            type='button'
            className={styles.signInButton}
            onClick={ () => {}}
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
            onClick={ () => {}}
        >
            <FaGithub color='FFB800'/>
            Entrar com Github
        </button>
    )
}