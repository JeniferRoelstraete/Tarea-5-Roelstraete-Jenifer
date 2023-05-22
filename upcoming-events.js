const {createApp} = Vue 

createApp({

    data(){
        return {
            eventos: [],
            categorias: [],
            categoriasSeleccionadas: [],
            filtradoEventosBusqueda: [],
            textoBusqueda: '',
            filtradoEventosFuturos: [],
            fecha: '',
        }
    },

    created(){
        const url =('https://mindhub-xj03.onrender.com/api/amazing')
        fetch(url)
        .then(respuesta => respuesta.json())
        .then(respuesta => { 
            this.fecha = respuesta.currentDate
            this.eventos = respuesta.events.filter(evento => evento.date >= this.fecha)
            this.filtradoEventosBusqueda = this.eventos
            this.categorias = Array.from(new Set(this.eventos.map(evento => evento.category)))
        })
        .catch(error => console.log(error))
    },

    computed : {
        filtrarEventosBusqueda() {
            console.log(this.categoriasSeleccionadas);
            this.filtradoEventosBusqueda = this.eventos
                .filter(evento => (this.categoriasSeleccionadas.length === 0 || this.categoriasSeleccionadas.includes(evento.category)) && evento.name.toLowerCase().includes(this.textoBusqueda.toLowerCase()))
        }
    }
}).mount('#app')