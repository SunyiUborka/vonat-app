import { defineStore } from "pinia"
import axios from 'axios'
import { vehiclePositions, tripDetails } from '@/stores/apiRequests'

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

      try{
        const res = await axios.post('/graphql-proxy',
          {query: vehiclePositions},
          {headers: {
            'Content-Type': 'application/json'
          }})
          
        if(res.status !== 200) throw new Error(res)
          this.data = res.data.data.vehiclePositions
      }catch (err){
        this.error = err.message
      }finally{
        this.loading = false
      }
    }
  },
  getters:{
    getTrains: (state) => state.data
  }
})
