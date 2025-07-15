const { default: axios } = require("axios")
const dayjs = require("dayjs")

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
    if(res.status !== 200) throw new Error(res)

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
    if(res.status !== 200) throw new Error(res)
    return res.data.data?.trip || {}
}

function getServiceDay() {
  return dayjs().format('YYYY-MM-DD');
}

const getTrains= async ()=>{
    const trains = await fetchTrainPosition()
    const serviceDay = getServiceDay()
    const data = Array()

    for (const train of trains) {
        const trip = trains.trip
        const { gtfsId, tripShortName, tripHeadsign } = trip
        const { vehicleId, lat, lon, label, speed, heading } = train

        const tripDetails = await fetchTripDetails(gtfsId, serviceDay)
        const { 
            trainCategoryName, 
            trainName,
            stoptimes,
            route: { 
                longName, 
                shortName 
            }} = tripDetails
        
        const stopCompressed = Array()

        for (const stop of stoptimes) {
            const { 
                stop, 
                lat, 
                lon, 
                name, 
                platformCode, 
                realtimeArrival,
                realtimeDeparture,
                scheduledArrival,
                scheduledDeparture,
                arrivalDelay,
                departureDelay
            } = stop

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
    }
}