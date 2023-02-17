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


type Item = {
    item: string,
    valor: number,
    quantidade: number
}

type ItemsList = {
    veiculo: string
    id: string
    cliente: string
    created: string | Date
    createdFormated? : string
    items: (Item)[] 
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
    /* lista de orcamentos*/
    const [itemsList, setItemsList] = useState<ItemsList[]>(JSON.parse(data))

    const [taskEdit, setTaskEdit] = useState<ItemsList | null>(null)

    //CRIAÇÃO DE TAREFAS
    async function handleAddTask(e: FormEvent){
        e.preventDefault()
        if (input === '') {
            alert ( 'preencha alguma tarefa')
        }

/*
        if (taskEdit){
            const docRef = doc(db, 'tasks', taskEdit.id)
            await updateDoc(docRef,{
                tarefa: input
            }).then(() => {
                let data = itemsList
                let taskIndex = itemsList.findIndex( item => item.id === taskEdit.id)
                data[taskIndex].orcamento = input
                setItemsList(data)
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
            setItemsList([dataStored, ...itemsList])
            setInput('')
        })
        .catch((err)=>{
            console.log('Erro ao cadastrar: ', err)
        })
        inputField.focus()
       */

    }

    // EXCLUSÃO DE TAREFAS
    async function handleDelete(id: string){
        const docRef = doc(db, 'tasks', id)
        await deleteDoc(docRef)
        .then(()=>{
            console.log('deletado com sucesso')
            let taskDeleted = itemsList.filter(
                item => { 
                    return (item.id != id) 
                })
                setItemsList(taskDeleted)
        })
        .catch((err)=>{
            console.log(err)
        })

        
       
    }
    
    function handleEdit(orcamento: ItemsList) {
        setTaskEdit(orcamento)
       // setInput(orcamento.items)
    }

    function handleCancelEdit(){
        setInput('')
      //  setTaskEdit(null)
    }

    return (
        <>
            <Head>
                <title>Minhas tarefas - Board</title>
            </Head>
            <main >
                
                <h1>Você tem {itemsList.length} orcamento{itemsList.length === 1? '': 's'}!</h1>

                <section>
                    {itemsList.map( orcamento => (
                        <article className={styles.itemsList} key={orcamento.id}>
                            <h2>{orcamento.cliente} - {orcamento.veiculo}</h2>
                                    {orcamento.items.map( (peca, index) => (
                                        <p key={index}> {peca.item} - {peca.quantidade} - {peca.valor}</p>
                                    ))}
                        </article>     
                    ))}
                </section>
            </main>
           
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

    const docRef = collection(db, 'orcamentos')
    const q = query(docRef, where('userId', '==',  session.id), orderBy("created_at", "desc"))
    const orcamentos = await getDocs(q)
    const data = JSON.stringify(orcamentos.docs.map( u => {
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