import Link from 'next/link'
import styles from './styles.module.scss'
import { SignInButton } from '../SignInButton'

export function Header() {
    return(
        <header className={styles.headerContainer}>
            <div className={styles.herderContent}>
                <Link href="/">
                    <img src="/images/logo.svg" alt="Logo Board" />
                </Link>
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/orcamentos">Meus orçamentos</Link>
                    <Link href="/pecas">Peças</Link>

                </nav>
                <SignInButton/>
            </div>
        </header>
    )
}