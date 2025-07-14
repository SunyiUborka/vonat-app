export const vehiclePositions = `{
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

export const tripDetails = (gtfs_id, service_day)=> `{
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