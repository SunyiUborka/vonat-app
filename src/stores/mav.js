import { defineStore } from "pinia"
import axios from 'axios'
import { vehiclePositions, tripDetails } from '@/stores/apiQuery'

export const useMavStore = defineStore('mav',  {
  state: ()=>({
    data:[],
    loading: false,
    error: null
  }),
  actions:{
    async fetchTrains(){
      this.loading = true
      this.error = null
      let trains
      try{
        const res = await axios.post('/graphql-proxy',
          {query: vehiclePositions},
          {headers: {
            'Content-Type': 'application/json'
          }})
          
        

        for (const train of trains) {
          trip = train.trip
          gtfsId = trip.gtfsId
          tripDetails = 
        }

      }catch (err){
        this.error = err.message
      }finally{
        this.loading = false
      }
    },
    async fetchTrainTrips(){

    }
  },
  getters:{
    getTrains: (state) => state.data
  }
})
