const param = location.search
const searchParams = new URLSearchParams(param)
const idEvento = searchParams.get('id')

const {createApp} = Vue 

createApp({

    data(){
        return {
           evento: '',
        }
    },

    created(){
        const url =('https://mindhub-xj03.onrender.com/api/amazing')
        fetch(url)
        .then(respuesta => respuesta.json())
        .then(respuesta => { this.evento = respuesta.events.filter(evento => evento._id.toString() === idEvento)[0]
            console.log(this.evento)
        })
        .catch(error => console.log(error))
    },
    }


).mount('#app')