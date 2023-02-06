import { GetServerSideProps } from 'next'
import { getSession} from 'next-auth/react'
import {useState, FormEvent} from 'react'
import Head from 'next/head'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash } from 'react-icons/fi'
import { SupportButton } from '../../components/SupportButton'
import styles from './styles.module.scss'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries




interface BoardProps{
    user: {
        id: string,
        nome: string
    }
}


export default function Board( { user} : BoardProps) {

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCAdje_IUVl6k1FCeJLqtVxK4eMsAtmmkw",
        authDomain: "board-app-a9af0.firebaseapp.com",
        projectId: "board-app-a9af0",
        storageBucket: "board-app-a9af0.appspot.com",
        messagingSenderId: "1098795360357",
        appId: "1:1098795360357:web:c0b9476d2098949fdc268c"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [input, setInput] = useState('')

    async function handleAddTask(e: FormEvent){
        e.preventDefault()
        if (input === '') {
            alert ( 'preencha alguma tarefa')
        }
        const docRef = db.collection('tarefas').doc('board-app');

        await docRef.set({
            created: new Date(),
            tarefa: input,
            userId: user.id,
            nome: user.nome
        })
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