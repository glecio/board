import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { doc, getDoc, query, where } from 'firebase/firestore'
import { db } from "../../services/firebaseConnection"
import format from "date-fns/format"

type Item = {
    nome: string,
    valor: number,
    quantidade: number
}


type Orcamento = {
    id: string,
    created: string | Date,
    createdFormated?: string,
    items: Item[]
    userId: string,
    nome: string
}

/* Passa os Json para a página de detalhes */
interface TaskListProps {
    data: string
}

export default function Task( {data} : TaskListProps){
    const task = JSON.parse(data)
    return(
        <>
        <h1>Página detalhes</h1>
        <p>{task.tarefa}</p>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const { id} = params
    const session = await getSession({req})

    if (!session?.id){
        return {
            redirect:{
                destination: '/board',
                permanent: false
            }
        }
    }
    
    const docRef = doc(db, 'orcamentos', String(id))
    const data = await getDoc(docRef).then((snapshot) => {
        const data = {
            id: snapshot.id,
            created: snapshot.data().created_at,
            createdFormated: format(snapshot.data().created_at.toDate(), 'dd MMMM yyyy'),
            items: snapshot.data().items,
            userId: snapshot.data().userId,
            nome: snapshot.data().nome
        }
        return JSON.stringify(data)
        
    })

   

    return {
        props:{
            data
        }
    }
}