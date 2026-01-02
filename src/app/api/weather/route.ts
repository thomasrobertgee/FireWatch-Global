import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!lat || !lon || !apiKey) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        // Fetch current weather
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherRes.json();

        // Calculate simplified Fire Danger Index (FFDI approximation)
        // McArthur FFDI is complex, we will use a simplified Chandler Burning Index or simple varying logic for MVP visuals.
        // Chandler Burning Index (CBI) = (((110 - 1.373*RH) - 0.54 * (10.20 - T)) * (124 * 10^(-0.0142*RH)))/60 ... simplified version:

        // Let's use a heuristic based on Australian FDRS:
        // Temp > 35 + Low Humidity (< 15%) + Wind (> 30km/h) = Extreme/Catastrophic

        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed * 3.6; // m/s to km/h

        let rating = "Moderate";
        let fdi = 12; // Base

        if (temp > 25) fdi += 20;
        if (temp > 35) fdi += 30;
        if (humidity < 30) fdi += 20;
        if (humidity < 15) fdi += 30;
        if (windSpeed > 20) fdi += 15;
        if (windSpeed > 40) fdi += 30;

        if (fdi < 25) rating = "Moderate";
        else if (fdi < 50) rating = "High";
        else if (fdi < 75) rating = "Extreme";
        else rating = "Catastrophic";

        return NextResponse.json({
            temp: temp,
            humidity: humidity,
            windSpeed: windSpeed, // in km/h
            windDeg: weatherData.wind.deg,
            locationName: weatherData.name,
            fireDangerIndex: fdi,
            fireDangerRating: rating
        });

    } catch (error) {
        return NextResponse.json({ error: 'Weather API Failed' }, { status: 500 });
    }
}
