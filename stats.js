const {createApp} = Vue 

createApp({

    data(){
        return {
            eventos: [],
            categorias: [],
            filtradoEventosBusqueda: [],
            fechaActual: '',
            filasFuturas: [],
            filasPasadas:[],
            filaGeneral:{},
            eventoMayorAsistencia: '',
            eventoMenorAsistencia: '',
            eventoMayorCapacidad: ''
        }
    },

    created(){
        const url =('https://mindhub-xj03.onrender.com/api/amazing')
        fetch(url)
        .then(respuesta => respuesta.json())
        .then(respuesta => { this.eventos = respuesta.events
            this.fechaActual = respuesta.currentDate
            this.filtradoEventosBusqueda = this.eventos
            this.categorias = Array.from(new Set(this.eventos.map(evento => evento.category)))

            const porcentajeAsistenciaPorEvento = this.eventos.filter(evento => evento.assistance).map(evento => [evento.name, evento.assistance / evento.capacity * 100])
            const mayorPorcentajeAsistencia = Math.max(...porcentajeAsistenciaPorEvento.map(evento => evento[1]))
            this.eventoMayorAsistencia = porcentajeAsistenciaPorEvento.find(evento => evento[1] === mayorPorcentajeAsistencia)[0]
            const menorPorcentajeAsistencia = Math.min(...porcentajeAsistenciaPorEvento.map(evento => evento[1]))
            this.eventoMenorAsistencia = porcentajeAsistenciaPorEvento.find(evento => evento[1] === menorPorcentajeAsistencia)[0]
            const eventoPorCapacidad = this.eventos.map(evento => [evento.name, evento.capacity])
            const mayorCapacidad =  Math.max(...eventoPorCapacidad.map(evento => evento[1]))
            this.eventoMayorCapacidad = eventoPorCapacidad.find(evento => evento[1] === mayorCapacidad)[0]

            this.filaGeneral = {
                mayorAsistencia: mayorPorcentajeAsistencia,
                menorAsistencia: menorPorcentajeAsistencia,
                mayorCapacidad: mayorCapacidad,
            }

            for (const categoria of this.categorias ) {
                const eventosPasadosAgrupadosPorCategoria = this.eventos
                    .filter(evento => evento.category === categoria && evento.date < this.fechaActual) 
                const eventosFuturosAgrupadosPorCategoria = this.eventos
                    .filter(evento => evento.category === categoria && evento.date >= this.fechaActual)


                // Cálculo de ingresos (columna Revenues)
                const ingresoTotalEventosPasadosPorCategoria = eventosPasadosAgrupadosPorCategoria
                    .reduce((ingresoTotal, evento) => ingresoTotal + evento.price * evento.assistance, 0)
                const ingresoTotalEventosFuturosPorCategoria = eventosFuturosAgrupadosPorCategoria
                    .reduce((ingresoTotal, evento) => ingresoTotal + evento.price *  evento.estimate, 0)
                
                // Cálculo de % asistencia (columna attendance)
                const porcentajeAsistenciaEventosPasadosPorCategoria = eventosPasadosAgrupadosPorCategoria
                    .reduce((porcentajeTotal, evento) => porcentajeTotal + evento.assistance / evento.capacity, 0) * 100 / eventosPasadosAgrupadosPorCategoria.length //promedio
                const porcentajeAsistenciaEventosFuturosPorCategoria = eventosFuturosAgrupadosPorCategoria
                    .reduce((porcentajeTotal, evento) => porcentajeTotal + evento.estimate / evento.capacity, 0) * 100 / eventosFuturosAgrupadosPorCategoria.length //promedio

                if (eventosPasadosAgrupadosPorCategoria.some(evento => evento.category === categoria)) {
                    this.filasPasadas.push({
                        categoria: categoria,
                        ingresos: ingresoTotalEventosPasadosPorCategoria,
                        porcentaje: porcentajeAsistenciaEventosPasadosPorCategoria,
                    })
                } 

                if (eventosFuturosAgrupadosPorCategoria.some(evento => evento.category === categoria)) {
                    this.filasFuturas.push({
                        categoria: categoria,
                        ingresos: ingresoTotalEventosFuturosPorCategoria,
                        porcentaje: porcentajeAsistenciaEventosFuturosPorCategoria,
                    })
                }
            }
        })
        .catch(error => console.log(error))
    },

    methods: {
        filtrarEventosBusqueda() {
            console.log(this.textoBusqueda);
            this.filtradoEventosBusqueda = this.eventos
                .filter(evento => (this.categorias.length === 0 || this.categorias.includes(evento.category)) && evento.name.toLowerCase().includes(this.textoBusqueda.toLowerCase()))
        }
    },



}).mount('#app')
