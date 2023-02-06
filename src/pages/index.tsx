
import { Inter } from '@next/font/google'
import Image from 'next/image'
import styles from '../styles/styles.module.scss'
import Head from 'next/head'
import { GetStaticProps } from 'next'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizador de Tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src="/images/board-user.svg" alt="Ferramenta board" width={300} height={300}/>  
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se..</h1>
          <p>
            <span>100% Gratuita </span>e online
          </p>
        </section>
        <div className={styles.donaters}>
          <Image src="/images/steve.png" alt="Steve" width={200} height={200} />
          <Image src="/images/steve.png" alt="Steve" width={200} height={200} />
          <Image src="/images/steve.png" alt="Steve" width={200} height={200} />
          <Image src="/images/steve.png" alt="Steve" width={200} height={200} />
        </div>
      </main>
    </>
  )
}

const getStaticProps: GetStaticProps = async () => {

  return {
    props : {
      
      
    },
    revalidate: 60 * 60
  }

}
