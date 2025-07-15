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
