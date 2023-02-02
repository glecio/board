
import { Inter } from '@next/font/google'
import styles from '../styles/styles.module.scss'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizador de Tarefas</title>
      </Head>
      <div>
        <h1 className={styles.title}>As cores são <span>belas</span></h1>
      </div>
    </>
  )
}
