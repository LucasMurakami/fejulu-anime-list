const base_url = 'https://api.jikan.moe/v4/';

export async function getTopAnimes(limit = 10) {
    const url = `${base_url}top/anime?limit=${limit}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Failed to fetch top anime:', error);
        return [];
    }
}
