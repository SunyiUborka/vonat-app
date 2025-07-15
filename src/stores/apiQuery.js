import axios from 'axios'
import dayjs from 'dayjs'

const vehiclePositionsQuery = `{
    vehiclePositions(
        swLat: 45.5,
        swLon: 16.1,
        neLat: 48.7,
        neLon: 22.8,
        modes: [RAIL, RAIL_REPLACEMENT_BUS]
    ){
    trip{
        gtfsId
        tripShortName
        tripHeadsign
        }
        vehicleId
        lat
        lon
        label
        speed
        heading
    }}`

const tripDetailsQuery = (gtfs_id, service_day)=> `{
    trip(id: "${gtfs_id}", serviceDay: "${service_day}"){
        gtfsId
        tripHeadsign
        trainCategoryName
        trainName
        route {
        longName(language: "hu")
        shortName
    }
    stoptimes{
        stop{
            name
            lat
            lon
            platformCode
        }
        realtimeArrival
        realtimeDeparture
        arrivalDelay
        departureDelay
        scheduledArrival
        scheduledDeparture
    }}}`

const fetchTrainPosition = async () =>{
    const res = await axios.post('/graphql-proxy',{
        query: vehiclePositionsQuery
    },{
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
    }})
    //if(res.status !== 200) throw new Error('1')

    return res.data.data?.vehiclePositions || {}
}

const fetchTripDetails = async (gtfsId, serviceDay) =>{
    const res = await axios.post('/graphql-proxy',{
        query: tripDetailsQuery(gtfsId, serviceDay)
    },{
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
    }})
    //if(res.status !== 200) throw new Error('2')
    return res.data.data?.trip || {}
}

const getServiceDay =()=> {
  return dayjs().format('YYYY-MM-DD');
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const secondsToHHMM = (seconds) => {
    let totalMinutes = Math.floor(seconds / 60);
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const getTrains= async ()=>{
    const trains = await fetchTrainPosition()
    const serviceDay = getServiceDay()
    const data = {
        'lastUpdate': dayjs().unix(),
        'trains': Array()
    }
    console.log(trains);
    
    let count = 0
    for (const train of trains) {
        if(count >= 3)
            break;
        const trip = train.trip
        const { gtfsId, tripShortName, tripHeadsign } = trip
        const { vehicleId, lat, lon, label, speed, heading } = train

        await delay(500)

        const tripDetails = await fetchTripDetails(gtfsId, serviceDay)
        console.log(tripDetails);
        
        const { 
            trainCategoryName, 
            trainName,
            stoptimes,
            route: { 
                longName, 
                shortName 
            }} = tripDetails
        
        const stopCompressed = Array()

        for (const st of stoptimes) {
            let {
                stop:{
                    lat, 
                    lon,
                    name,
                    platformCode,
                },
                realtimeArrival,
                realtimeDeparture,
                scheduledArrival,
                scheduledDeparture,
                arrivalDelay,
                departureDelay
            } = st
            realtimeArrival = secondsToHHMM(realtimeArrival)
            realtimeDeparture = secondsToHHMM(realtimeDeparture)
            scheduledArrival = secondsToHHMM(scheduledArrival)
            scheduledDeparture = secondsToHHMM(scheduledDeparture)

            stopCompressed.push({
                'name': name,
                'ra': realtimeArrival,
                'rd': realtimeDeparture,
                'sa': scheduledArrival,
                'sd': scheduledDeparture,
                'a': arrivalDelay,
                'd': departureDelay,
                'v': platformCode
            })          
        }
        let name = tripShortName
        if (longName !== null && longName.length < 6)
            name = `[${longName}] ${tripShortName}`

        data.trains.push({
            "id": gtfsId,
            "name": name,
            "headsgn": tripHeadsign,
            'lat': lat,
            'lon': lon,
            'sp': speed,
            'hd': heading,
            'stops': stopCompressed
        })
        count++
    }
    return data
}