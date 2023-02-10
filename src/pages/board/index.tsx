import { GetServerSideProps } from 'next'
import { getSession} from 'next-auth/react'
import {useState, FormEvent} from 'react'
import Head from 'next/head'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import styles from './styles.module.scss'
import {db, firebaseApp} from '../../services/firebaseConnection'
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import {format} from 'date-fns'
import Link from 'next/link'

type TaskList = {
    id: string
    created: string | Date
    createdFormated? : string
    tarefa: string
    userId: string
    nome: string
}

interface BoardProps{
    user: {
        id: string,
        nome: string
    }
}

export default function Board( { user, data} : BoardProps) {
  
    const [input, setInput] = useState('')
    const [taskList, setTasklist] = useState<TaskList[]>(JSON.parse(data))

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
        const res = await addDoc(docRef, data)
        .then((doc) => {
            console.log('cadastrado com sucesso:', doc)
            let dataStored = {
                id: doc.id,
                created: new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                tarefa: input,
                userId: user.id,
                nome: user.nome
            }
            setTasklist([...taskList, dataStored])
            console.log(taskList)
            setInput('')
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
                <h1>Você tem {taskList.length} tarefa{taskList.length === 1? '': 's'}!</h1>

                <section>
                    {taskList.map( task => (
                        <article className={styles.taskList} key={task.id}>
                            <Link href={`board/${task.id}`}>
                                <p>{task.task}</p>
                            </Link>
                            <div className={styles.actions}>
                                <div>
                                    <div>   
                                        <FiCalendar size={20} color="#ffb800" />
                                        <time>{task.createdFormated}</time>
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
                    ))}
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

    const docRef = collection(db, 'tasks')
    const tasks = await getDocs(docRef)
    const data = JSON.stringify(tasks.docs.map( u => {
        return {
            id: u.id,
            createdFormated: format(u.data().created_at.toDate(), 'dd MMMM yyyy'),
            ...u.data()
        }
       
    }))
    console.log(data)
    const user = {
        nome: session?.session.user.name ,
        id: session?.id
    }

    return {
            props:{
                user,
                data
        }
    }
}