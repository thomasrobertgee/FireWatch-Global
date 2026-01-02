export interface WeatherData {
    temp: number;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    locationName: string;
    fireDangerIndex: number; // 0-100+
    fireDangerRating: string; // "Low-Moderate", "High", "Extreme", "Catastrophic"
}

export async function fetchLocalWeather(lat: number, lon: number): Promise<WeatherData | null> {
    try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY; // Client-side usage requires NEXT_PUBLIC or server proxy. User said .env, usually server side.
        // If we do client side fetch, we need NEXT_PUBLIC.
        // If we do server action, we can use private key.
        // Let's assume we might need a server action or API route to hide the key, OR just use it if it is safe for MVP.
        // For MVP, I will create a server action or just fetch from client if the user prefixed it. 
        // User said "added OPENWEATHER_API_KEY", so it's likely private. I should create an API route.

        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!res.ok) throw new Error("Failed to fetch weather");
        return await res.json();
    } catch (error) {
        console.error("Weather fetch failed", error);
        return null;
    }
}
