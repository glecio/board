import { GetServerSideProps } from 'next'
import { getSession} from 'next-auth/react'
import {useState, FormEvent} from 'react'
import Head from 'next/head'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import styles from './styles.module.scss'

import {db, firebaseApp} from '../../services/firebaseConnection'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'


interface BoardProps{
    user: {
        id: string,
        nome: string
    }
}

export default function Board( { user} : BoardProps) {
  
    const [input, setInput] = useState('')

    async function handleAddTask(e: FormEvent){
        e.preventDefault()
        if (input === '') {
            alert ( 'preencha alguma tarefa')
        }

        const data = {
            created_at: new Date(),
            task: input,
            userId: user.id,
            name: user.nome
        }

        const docRef = collection(db, 'tasks')

        const res = await addDoc(docRef, data).
        then((doc) => {
            console.log('cadastrado com sucesso')
        })
        .catch((err)=>{
            console.log('Erro ao cadastrar: ', err)
        }

        )
                   
       
    }

    return (
        <>
            <Head>
                <title>Minhas tarefas - Board</title>
            </Head>
            <main className={styles.container}>
                <form onSubmit={handleAddTask}>
                    <input 
                        type="text" 
                        placeholder='Digite a tarefa...'
                        value={input}
                        onChange={ (e) => setInput(e.target.value)}
                    />
                    <button type='submit'>
                        <FiPlus size={25} color="#17181f" />
                    </button>

                </form>
                <h1>Você tem 2 tarefas!</h1>

                <section>
                    <article className={styles.taskList}>
                        <p>Aprender a criar projetos usando NextJS e aplicando firebase como backend</p>
                        <div className={styles.actions}>
                            <div>
                                <div>   
                                    <FiCalendar size={20} color="#ffb800" />
                                    <time>17 julho 2021</time>
                                </div>
                                <button>
                                    <FiEdit2 size={20} color="#fff" />
                                    <span>Editar</span>
                                </button>
                            </div>
                            <button>
                                <FiTrash size={20} color="#ff3636"/>
                                <span>Excluir</span>
                            </button>

                        </div>
                    </article>
                </section>
            </main>
            <div className={styles.vipContainer}>
                <h3>Obrigado por apoiar esse projeto.</h3>
                <div>
                    <FiClock size={28} color="#fff"/>
                    <time>
                        Última doação foi a 3 dias.
                    </time>
                </div>
            </div>
            <SupportButton/>
        
        </>
        )
}

export const getServerSideProps: GetServerSideProps = async({ req }) =>{
    const session = await getSession({ req })
    
    if(!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

   
    const user = {
        nome: session?.session.user.name ,
        id: session?.id
    }

    return {
            props:{
                user
        }
    }
}