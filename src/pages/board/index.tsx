import { GetServerSideProps } from 'next'
import { getSession} from 'next-auth/react'
import {useState, FormEvent} from 'react'
import Head from 'next/head'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash, FiX } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import styles from './styles.module.scss'
import {db, firebaseApp} from '../../services/firebaseConnection'
import { addDoc, collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, deleteDoc, updateDoc } from 'firebase/firestore'
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
    data: string
}

export default function Board( { user, data} : BoardProps) {
  
    const [input, setInput] = useState('')
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))

    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)

    //CRIAÇÃO DE TAREFAS
    async function handleAddTask(e: FormEvent){
        let inputField = document.getElementById('taskInput')
        e.preventDefault()
        if (input === '') {
            alert ( 'preencha alguma tarefa')
        }

        if (taskEdit){
            const docRef = doc(db, 'tasks', taskEdit.id)
            await updateDoc(docRef,{
                tarefa: input
            }).then(() => {
                let data = taskList
                let taskIndex = taskList.findIndex( item => item.id === taskEdit.id)
                data[taskIndex].tarefa = input
                setTaskList(data)
                setTaskEdit(null)
                setInput('')
            })
            inputField.focus()
            return
        }

        const data = {
            created_at: new Date(),
            tarefa: input,
            userId: user.id,
            nome: user.nome
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
            setTaskList([dataStored, ...taskList])
            setInput('')
        })
        .catch((err)=>{
            console.log('Erro ao cadastrar: ', err)
        })
        inputField.focus()
       
    }

    // EXCLUSÃO DE TAREFAS
    async function handleDelete(id: string){
        const docRef = doc(db, 'tasks', id)
        await deleteDoc(docRef)
        .then(()=>{
            console.log('deletado com sucesso')
            let taskDeleted = taskList.filter(
                item => { 
                    return (item.id != id) 
                })
                setTaskList(taskDeleted)
        })
        .catch((err)=>{
            console.log(err)
        })

        
       
    }
    
    function handleEdit(task: TaskList) {
        setTaskEdit(task)
        setInput(task.tarefa)
    }

    function handleCancelEdit(){
        setInput('')
        setTaskEdit(null)
    }

    return (
        <>
            <Head>
                <title>Minhas tarefas - Board</title>
            </Head>
            <main className={styles.container}>
                {taskEdit && (
                    <span className={styles.warnText}>
                        <button onClick={()=>handleCancelEdit()}>
                            <FiX size={30} color='#ff3636'/>
                        </button>
                        Você está editando a tarefa!
                    </span>
                )}
                <form onSubmit={handleAddTask}>
                    <input 
                        type="text"
                        id="taskInput" 
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
                                <p>{task.tarefa}</p>
                            </Link>
                            <div className={styles.actions}>
                                <div>
                                    <div>   
                                        <FiCalendar size={20} color="#ffb800" />
                                        <time>{task.createdFormated}</time>
                                    </div>
                                    <button onClick={() => handleEdit(task)}>
                                        <FiEdit2 size={20} color="#fff" />
                                        <span>Editar</span>
                                    </button>
                                </div>
                                <button onClick={() => handleDelete(task.id)}>
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
    const q = query(docRef, where('userId', '==',  session.id), orderBy("created_at", "desc"))
    const tasks = await getDocs(q)
    const data = JSON.stringify(tasks.docs.map( u => {
        return {
            id: u.id,
            createdFormated: format(u.data().created_at.toDate(), 'dd MMMM yyyy'),
            ...u.data()
        }
       
    }))

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